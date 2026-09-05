import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using RemixKit digital services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="section-label">Legal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-neutral-500">
            Last updated: September 5, 2026
          </p>
          <div className="prose prose-neutral mt-10 max-w-none text-sm leading-7">
            <h2>1. About RemixKit</h2>
            <p>
              RemixKit provides online AI-assisted image prompt and image
              editing tools. By using the website, you agree to these terms.
            </p>
            <h2>2. Accounts</h2>
            <p>
              You are responsible for maintaining access to your account and for
              all activity performed through it. You must provide accurate
              information and may not use another person&apos;s account.
            </p>
            <h2>3. Credits and digital services</h2>
            <p>
              Credits are digital usage units for eligible RemixKit tools.
              Credits are consumed when a requested image edit is processed.
              Purchased credits are not transferable or redeemable for cash.
            </p>
            <h2>4. Acceptable use</h2>
            <p>
              You must not upload illegal, abusive, infringing, or sexually
              explicit content, attempt to bypass usage limits, abuse payment
              systems, or interfere with the service.
            </p>
            <h2>5. Content</h2>
            <p>
              You retain rights to content you upload. You grant RemixKit
              permission to process that content only as needed to provide the
              requested service. You are responsible for having the rights to
              use uploaded content.
            </p>
            <h2>6. Availability and changes</h2>
            <p>
              We may update, suspend, or discontinue features when necessary for
              maintenance, security, legal compliance, or service improvements.
            </p>
            <h2>7. Contact</h2>
            <p>
              Questions about these terms can be sent through our{" "}
              <a href="/contact">Contact Us</a> page.
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
