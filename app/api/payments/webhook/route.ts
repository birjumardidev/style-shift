import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function validSignature(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = request.headers.get("x-razorpay-signature");
  if (!secret || !signature)
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 503 },
    );

  const payload = await request.text();
  if (!validSignature(payload, signature, secret))
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 401 },
    );

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: { id?: string; order_id?: string };
      };
    };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook payload." },
      { status: 400 },
    );
  }

  if (event.event !== "payment.captured" && event.event !== "order.paid")
    return NextResponse.json({ received: true });

  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id;
  const paymentId = payment?.id;
  if (!orderId || !paymentId)
    return NextResponse.json(
      { error: "Incomplete payment event." },
      { status: 400 },
    );

  const admin = getSupabaseAdmin();
  const { data: order, error: orderError } = await admin
    .from("credit_orders")
    .select("user_id, credits, status")
    .eq("order_id", orderId)
    .maybeSingle();
  if (orderError) {
    console.error("Payment webhook order lookup failed:", orderError.message);
    return NextResponse.json(
      { error: "Unable to process payment." },
      { status: 500 },
    );
  }
  if (!order) return NextResponse.json({ received: true });
  if (order.status === "paid") return NextResponse.json({ received: true });

  const { error: creditError } = await admin.rpc("apply_credit_purchase", {
    target_user_id: order.user_id,
    credit_amount: order.credits,
    order_id: orderId,
    payment_id: paymentId,
  });
  if (creditError) {
    console.error(
      "Payment webhook credit application failed:",
      creditError.message,
    );
    return NextResponse.json(
      { error: "Unable to apply payment." },
      { status: 500 },
    );
  }

  const { error: statusError } = await admin
    .from("credit_orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("order_id", orderId)
    .eq("status", "pending");
  if (statusError) {
    console.error("Payment webhook status update failed:", statusError.message);
    return NextResponse.json(
      { error: "Payment received but status update failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
