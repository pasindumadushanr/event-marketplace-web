import Link from "next/link";
export default function ContentBuilderPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 rounded-2xl border bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-bold">
        Custom sections are not available yet
      </h1>
      <p>
        Your existing custom sections are retained. Editing will return when
        these sections can be displayed on your public page.
      </p>
      <p>
        You can edit your introduction, services, photos, questions and policies
        in the business page editor.
      </p>
      <Link
        className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-white"
        href="/vendor/preview"
      >
        Edit your business page
      </Link>
    </main>
  );
}
