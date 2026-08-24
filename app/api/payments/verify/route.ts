import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAuthenticatedUser, getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
const allowedCredits = new Set([3, 11, 25, 45, 75]);

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const body = await request.json().catch(() => null);
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    credits,
  } = body || {};
  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string" ||
    !allowedCredits.has(credits)
  )
    return NextResponse.json(
      { error: "Invalid payment details." },
      { status: 400 },
    );
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  )
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 },
    );
  const admin = getSupabaseAdmin();
  const { data: order } = await admin
    .from("credit_orders")
    .select("user_id, credits, status")
    .eq("order_id", orderId)
    .maybeSingle();
  if (!order || order.user_id !== user.id || order.credits !== credits)
    return NextResponse.json(
      { error: "Payment account mismatch." },
      { status: 403 },
    );
  if (order.status === "paid")
    return NextResponse.json(
      { error: "This payment has already been applied." },
      { status: 409 },
    );
  const { data, error } = await admin.rpc("apply_credit_purchase", {
    target_user_id: user.id,
    credit_amount: credits,
    order_id: orderId,
    payment_id: paymentId,
  });
  if (error)
    return NextResponse.json(
      {
        error:
          "Payment received but credits could not be applied. Contact support with your payment ID.",
      },
      { status: 500 },
    );
  await admin
    .from("credit_orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("order_id", orderId)
    .eq("user_id", user.id)
    .eq("status", "pending");
  return NextResponse.json({ credits: data });
}
