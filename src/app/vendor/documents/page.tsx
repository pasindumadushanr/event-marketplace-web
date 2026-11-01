import Link from "next/link";
export default function VendorDocumentsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 rounded-2xl border bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold">Documents & verification</h1>
      <p>
        Document uploads are temporarily paused while private verification is
        prepared.
      </p>
      <p>
        Please do not send identity documents, insurance papers or registration
        files through email or WhatsApp. You can continue setting up your
        business page.
      </p>
      <Link
        className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-white"
        href="/vendor/support"
      >
        Contact support
      </Link>
    </main>
  );
}
