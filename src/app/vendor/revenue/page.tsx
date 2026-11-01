import Link from "next/link";
export default function VendorRevenuePage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 rounded-2xl border bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold">Payments are arranged directly</h1>
      <p>
        Nakathata.lk currently connects you with customers. Online payments,
        platform earnings and payouts are not available during launch.
      </p>
      <p>
        Agree prices and payment terms directly with your customer. Your
        bookings and messages remain available in your dashboard.
      </p>
      <Link
        className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-white"
        href="/vendor/bookings"
      >
        View bookings
      </Link>
    </main>
  );
}
