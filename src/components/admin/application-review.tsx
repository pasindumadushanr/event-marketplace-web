export type ApplicationSummary = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  district?: string;
  vendorStatus: string;
  status: string;
  submittedAt: string;
  createdAt: string;
  waitingDays: number;
  category?: { id: string; name: string };
  vendor: { firstName: string; lastName: string; email: string };
  _count?: { documents: number; galleries: number; packages: number };
};
export function reviewDate(date: string) {
  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date(date));
}
export function statusLabel(status: string) {
  return (
    (
      {
        PENDING: "Pending",
        UNDER_REVIEW: "Under review",
        NEEDS_INFO: "Needs information",
        APPROVED: "Approved",
        REJECTED: "Rejected",
        SUSPENDED: "Suspended",
      } as Record<string, string>
    )[status] || status
  );
}
export function WaitingBadge({
  application: app,
}: {
  application: ApplicationSummary;
}) {
  if (!["PENDING", "UNDER_REVIEW", "NEEDS_INFO"].includes(app.vendorStatus))
    return (
      <span className="rounded-full border px-3 py-1.5 text-xs">
        {app.status === "ACTIVE" ? "Published" : "Not published"}
      </span>
    );
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${app.waitingDays >= 3 ? "bg-amber-100 text-amber-900" : "bg-teal-50 text-teal-800"}`}
    >
      {app.vendorStatus === "NEEDS_INFO"
        ? "Awaiting vendor"
        : app.waitingDays
          ? `${app.waitingDays} ${app.waitingDays === 1 ? "day" : "days"} waiting`
          : "Less than 1 day waiting"}
    </span>
  );
}
export function safeAssetUrl(value?: string | null) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"))
    return value;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname))
    )
      return url.href;
  } catch {}
  return null;
}
export function FilePreview({
  url,
  label,
  image = false,
}: {
  url?: string | null;
  label: string;
  image?: boolean;
}) {
  const safe = safeAssetUrl(url);
  if (!safe)
    return (
      <p className="rounded-xl border p-4 text-sm text-slate-500">
        {label}: no supported file provided.
      </p>
    );
  const isImage = image || /\.(png|jpe?g|webp|gif)(?:[?#]|$)/i.test(safe);
  const pdf = /\.pdf(?:[?#]|$)/i.test(safe);
  return (
    <div className="overflow-hidden rounded-xl border bg-slate-50">
      {isImage ? (
        <img
          loading="lazy"
          src={safe}
          alt={label}
          className="h-48 w-full object-contain"
        />
      ) : pdf ? (
        <details className="p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Preview {label}
          </summary>
          <iframe
            title={label}
            src={safe}
            sandbox=""
            loading="lazy"
            className="mt-3 h-72 w-full rounded-lg border"
          />
          <p className="mt-2 text-xs text-slate-500">
            If the preview is unavailable, open the file below.
          </p>
        </details>
      ) : (
        <p className="p-4 text-sm">Preview unavailable for this file type.</p>
      )}
      <a
        className="block break-words border-t bg-white p-3 text-sm text-teal-800 underline"
        href={safe}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open {label}
      </a>
    </div>
  );
}
