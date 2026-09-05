import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAuthenticatedUser, getSupabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";
import { getRazorpayConfig } from "@/lib/razorpay";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
const packs = {
  poco: { amount: 100, credits: 3 },
  mini: { amount: 2900, credits: 11 },
  standard: { amount: 5900, credits: 25 },
  super: { amount: 9900, credits: 45 },
  mega: { amount: 14900, credits: 75 },
} as const;

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const limit = rateLimit(`payment-order:${user.id}`, 10, 5 * 60 * 1000);
  if (!limit.allowed)
    return NextResponse.json(
      { error: "Too many payment attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  const { pack } = await request.json().catch(() => ({ pack: "" }));
  const selected = packs[pack as keyof typeof packs];
  if (!selected)
    return NextResponse.json(
      { error: "Invalid credit pack." },
      { status: 400 },
    );
  const razorpayConfig = getRazorpayConfig();
  if (!razorpayConfig)
    return NextResponse.json(
      { error: "Payments are not configured." },
      { status: 503 },
    );
  try {
    const razorpay = new Razorpay({
      key_id: razorpayConfig.keyId,
      key_secret: razorpayConfig.keySecret,
    });
    const order = await razorpay.orders.create({
      amount: selected.amount,
      currency: "INR",
      receipt: `reframe_${user.id.slice(0, 8)}_${randomUUID().slice(0, 12)}`,
      notes: { user_id: user.id, credits: String(selected.credits) },
    });
    const { error: recordError } = await getSupabaseAdmin()
      .from("credit_orders")
      .insert({
        order_id: order.id,
        user_id: user.id,
        credits: selected.credits,
        amount: selected.amount,
      });
    if (recordError)
      return NextResponse.json(
        { error: "Unable to initialize the payment securely." },
        { status: 500 },
      );
    return NextResponse.json({
      orderId: order.id,
      amount: selected.amount,
      credits: selected.credits,
      keyId: razorpayConfig.keyId,
    });
  } catch (cause) {
    console.error(
      "Payment order creation failed:",
      cause instanceof Error ? cause.message : cause,
    );
    return NextResponse.json(
      { error: "Unable to start payment. Please try again." },
      { status: 502 },
    );
  }
}
