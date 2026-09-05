import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for RemixKit.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="section-label">Legal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Last updated: September 5, 2026
          </p>
          <div className="prose prose-neutral mt-10 max-w-none text-sm leading-7">
            <h2>1. Information we collect</h2>
            <p>
              When you sign in, we receive account information provided by your
              authentication provider, such as your name, email address, and
              profile image. We also process uploaded images and tool selections
              when you use our services.
            </p>
            <h2>2. How we use information</h2>
            <p>
              We use information to authenticate you, provide image processing,
              manage credits, process payments, prevent abuse, improve
              reliability, and respond to support requests.
            </p>
            <h2>3. Payments</h2>
            <p>
              Payments are processed by Razorpay. RemixKit does not store your
              complete card, bank, or UPI credentials. Payment identifiers and
              order details may be retained for reconciliation, fraud
              prevention, and support.
            </p>
            <h2>4. Service providers</h2>
            <p>
              We use infrastructure and processing providers, including
              Supabase, Razorpay, and AI processing services, only as needed to
              operate the requested features.
            </p>
            <h2>5. Retention and security</h2>
            <p>
              We retain account, credit, and payment records for operational,
              legal, and accounting purposes. We use access controls and
              server-side verification, but no online service can guarantee
              absolute security.
            </p>
            <h2>6. Your choices</h2>
            <p>
              You may request account or personal-data assistance through our{" "}
              <a href="/contact">Contact Us</a> page.
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
