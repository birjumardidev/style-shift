import { Mail, MapPin } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Contact Us",
  description: "Contact RemixKit support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="section-label">Support</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Contact Us
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-500">
            For account, payment, refund, or service questions, contact our
            support team.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:mardib776@gmail.com"
              className="rounded-2xl border border-neutral-200 p-5 transition hover:border-neutral-400"
            >
              <Mail className="h-5 w-5 text-violet-600" />
              <strong className="mt-3 block text-sm text-neutral-900">
                Support email
              </strong>
              <span className="mt-1 block text-sm text-neutral-600">
                mardib776@gmail.com
              </span>
            </a>
            <div className="rounded-2xl border border-neutral-200 p-5">
              <MapPin className="h-5 w-5 text-violet-600" />
              <strong className="mt-3 block text-sm text-neutral-900">
                Business address
              </strong>
              <span className="mt-1 block text-sm leading-6 text-neutral-600">
                Parsudih, Jamshedpur, Jharkhand 831002, India
              </span>
            </div>
          </div>
          <p className="mt-8 text-sm leading-6 text-neutral-500">
            Please include your account email and Razorpay order or payment ID
            for payment-related requests.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
