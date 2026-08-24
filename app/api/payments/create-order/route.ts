import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAuthenticatedUser, getSupabaseAdmin } from "@/lib/supabase-admin";

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
  const { pack } = await request.json().catch(() => ({ pack: "" }));
  const selected = packs[pack as keyof typeof packs];
  if (!selected)
    return NextResponse.json(
      { error: "Invalid credit pack." },
      { status: 400 },
    );
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
    return NextResponse.json(
      { error: "Payments are not configured." },
      { status: 503 },
    );
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const order = await razorpay.orders.create({
    amount: selected.amount,
    currency: "INR",
    receipt: `styleshift_${user.id.slice(0, 8)}_${Date.now()}`,
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
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
