import { policyHtml } from "@/lib/policy-html";

export function PolicyBody({ content }: { content: string }) {
  return (
    <article
      data-policy-content
      className="policy-content bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 text-slate-700 leading-relaxed text-sm sm:text-base break-words"
      dangerouslySetInnerHTML={{ __html: policyHtml(content) }}
    />
  );
}
