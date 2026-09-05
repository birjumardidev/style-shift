import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Refund and Cancellation Policy",
  description: "Refund and cancellation policy for RemixKit credit purchases.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="section-label">Payments</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Refund and Cancellation Policy
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Last updated: September 5, 2026
          </p>
          <div className="prose prose-neutral mt-10 max-w-none text-sm leading-7">
            <h2>1. Digital credits</h2>
            <p>
              RemixKit credit packs provide digital usage credits for our image
              tools. Credits are added after successful payment verification and
              are linked to the purchasing account.
            </p>
            <h2>2. Cancellation</h2>
            <p>
              You may cancel a payment before completing checkout. Once a
              payment is captured, cancellation is not available through the
              checkout flow.
            </p>
            <h2>3. Refund eligibility</h2>
            <p>
              Refund requests may be considered when payment was captured but
              credits were not delivered, the same payment was charged more than
              once, or a verified technical failure prevented the purchased
              service from being used. Used credits are generally not
              refundable.
            </p>
            <h2>4. Requesting a refund</h2>
            <p>
              Send the payment ID, order ID, account email, and a short
              explanation through our <a href="/contact">Contact Us</a> page. We
              may request additional information to verify the transaction.
            </p>
            <h2>5. Processing</h2>
            <p>
              Approved refunds are sent to the original payment method through
              the payment provider. Processing time depends on the provider and
              the customer&apos;s bank.
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
