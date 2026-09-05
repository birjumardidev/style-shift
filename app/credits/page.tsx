"use client";

import Script from "next/script";
import { Check, Coins, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

const packs = [
  { id: "poco", name: "Poco / Trial", price: 10, credits: 3 },
  { id: "mini", name: "Mini", price: 29, credits: 11 },
  { id: "standard", name: "Standard", price: 59, credits: 25 },
  { id: "super", name: "Super", price: 99, credits: 45 },
  { id: "mega", name: "Mega", price: 149, credits: 75 },
] as const;

export default function CreditsPage() {
  const { user, loading: authLoading } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentUnavailable, setPaymentUnavailable] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || user) return;
    const timer = window.setTimeout(() => setLoginOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      fetch("/api/credits", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      })
        .then((response) => response.json())
        .then((body) =>
          setCredits(typeof body.credits === "number" ? body.credits : null),
        );
    });
  }, [user]);

  async function buyCredits(packId: (typeof packs)[number]["id"]) {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      setLoginOpen(true);
      return;
    }
    setPaymentBusy(true);
    setError("");
    try {
      const selectedPack = packs.find((pack) => pack.id === packId)!;
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pack: packId }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) {
        if (orderResponse.status === 503) {
          setPaymentUnavailable(true);
          return;
        }
        throw new Error(order.error || "Unable to start payment.");
      }
      await new Promise<void>((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: "INR",
          name: "RemixKit",
          description: `${selectedPack.credits} Reframe credits`,
          order_id: order.orderId,
          prefill: { email: user?.email || "" },
          handler: async (payment) => {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...payment,
                credits: selectedPack.credits,
              }),
            });
            const verified = await verifyResponse.json();
            if (!verifyResponse.ok) {
              reject(
                new Error(verified.error || "Payment verification failed."),
              );
              return;
            }
            setCredits(verified.credits);
            resolve();
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
        });
        checkout.on("payment.failed", () =>
          reject(new Error("Payment failed. No credits were added.")),
        );
        checkout.open();
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment failed.");
    } finally {
      setPaymentBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label justify-center">
            <Coins className="h-4 w-4" /> Your credits
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Choose your credit pack
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-500">
            One credit creates one Reframe image. Credits stay on your account
            for future edits.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-900">
            Current balance: {credits ?? "..."} credits
          </div>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack, index) => (
            <section
              key={pack.id}
              className={`flex flex-col rounded-3xl border bg-white p-6 shadow-sm ${index === 2 ? "border-violet-400 ring-2 ring-violet-100" : "border-neutral-200"}`}
            >
              {index === 2 && (
                <span className="mb-3 w-fit rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-violet-700">
                  MOST POPULAR
                </span>
              )}
              <p className="text-sm font-semibold text-neutral-500">
                {pack.name}
              </p>
              <p className="mt-3 text-3xl font-bold text-neutral-900">
                ₹{pack.price}
              </p>
              <p className="mt-2 text-lg font-semibold text-violet-700">
                {pack.credits} credits
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                <Check className="h-4 w-4 text-emerald-600" /> Works with
                Reframe
              </p>
              <button
                type="button"
                disabled={paymentBusy || !user || paymentUnavailable}
                onClick={() => buyCredits(pack.id)}
                className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3 text-sm font-bold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {paymentUnavailable ? "Coming soon" : "Buy pack"}
              </button>
            </section>
          ))}
        </div>
        <div className="mt-5 flex flex-col items-center justify-center gap-1 text-center text-xs text-neutral-500 sm:flex-row sm:gap-5">
          <span>Credits added instantly via UPI</span>
          <span>1 Credit = 1 Image Generation.</span>
        </div>
        {paymentUnavailable && (
          <p className="mx-auto mt-5 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
            Online payments are temporarily unavailable. No payment was created
            and no credits were charged.
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </main>
      <AuthDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <SiteFooter />
    </div>
  );
}
