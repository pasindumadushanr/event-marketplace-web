import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function PaymentsUnavailable() {
  return (
    <main className="min-h-[65vh] flex items-center justify-center px-4 py-16 bg-stone-50">
      <section
        className="max-w-lg w-full rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm"
        data-testid="payments-unavailable"
      >
        <MessageCircle
          className="mx-auto mb-5 h-10 w-10 text-emerald-800"
          aria-hidden="true"
        />
        <h1 className="text-3xl font-bold text-slate-900">
          Online payments are not available
        </h1>
        <p className="mt-4 text-slate-600">
          You can still explore vendors and send inquiries. Discuss
          availability, prices, and booking terms directly with your vendor.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          This page does not collect payments or confirm a payment or booking.
        </p>
        <Link
          href="/vendors"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-900 px-6 font-semibold text-white"
        >
          Explore vendors
        </Link>
      </section>
    </main>
  );
}
