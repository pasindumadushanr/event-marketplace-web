"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import {
  ApplicationSummary,
  FilePreview,
  reviewDate,
  statusLabel,
  WaitingBadge,
} from "@/components/admin/application-review";

type ReviewEvent = {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  message?: string;
  createdAt: string;
  notificationStatus: string;
};
type Detail = {
  application: ApplicationSummary & {
    description?: string;
    address?: string;
    province?: string;
    zipCode?: string;
    country?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    googleMapLocation?: string;
    logo?: string;
    coverImage?: string;
    verificationDocs?: string;
    isVerified: boolean;
    rejectionReason?: string;
    informationRequest?: string;
    profileSettings?: any;
    vendor: ApplicationSummary["vendor"] & {
      id: string;
      phone?: string;
      status: string;
      emailVerified: boolean;
    };
    galleries: { id: string; url: string; type: string }[];
    documents: { id: string; url: string; type: string; status: string }[];
    packages: {
      id: string;
      image?: string;
      name: string;
      description?: string;
      price: string;
      duration?: string;
      features: string[];
      status: string;
    }[];
    contentSections: {
      id: string;
      title: string;
      description?: string;
      imageUrl?: string;
      content: unknown;
      status: string;
    }[];
  };
  history: {
    items: ReviewEvent[];
    total: number;
    page: number;
    pageSize: number;
  };
};
function Fields({ values }: { values: Record<string, string | undefined> }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {Object.entries(values).map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs font-medium text-slate-500">{label}</dt>
          <dd className="mt-1 break-words text-sm text-slate-900">
            {value || "Not provided"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
const titles: Record<string, string> = {
  NOTE: "Private reviewer note",
  APPROVED: "Application approved",
  REJECTED: "Application rejected",
  INFORMATION_REQUESTED: "More information requested",
  RESUBMITTED: "Vendor resubmitted application",
};
function ReviewContent({
  value,
  depth = 0,
}: {
  value: unknown;
  depth?: number;
}): React.ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object")
    return (
      <p className="whitespace-pre-wrap break-words text-sm">{String(value)}</p>
    );
  if (depth > 5)
    return <p className="text-xs text-slate-500">Additional nested content</p>;
  if (Array.isArray(value))
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3">
            <ReviewContent value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  return (
    <dl className="space-y-2">
      {Object.entries(value).map(([key, item]) => (
        <div key={key}>
          <dt className="text-xs text-slate-500">
            {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
          </dt>
          <dd>
            <ReviewContent value={item} depth={depth + 1} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [action, setAction] = useState("request-information");
  const [busy, setBusy] = useState(false);
  const latestRequest = useRef(0);
  const applicationId = useRef(id);
  useEffect(() => {
    applicationId.current = id;
    setNote("");
    setMessage("");
    setHistoryPage(1);
    setAction("request-information");
    setBusy(false);
  }, [id]);
  const load = useCallback(async () => {
    if (applicationId.current !== id) return;
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(false);
    try {
      const result = await api.get(`/admin/vendors/applications/${id}`, {
        params: { historyPage },
      });
      if (requestId === latestRequest.current) setData(result.data);
    } catch {
      if (requestId === latestRequest.current) setError(true);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [id, historyPage]);
  useEffect(() => {
    void load();
  }, [load]);
  async function decide(event: React.FormEvent) {
    event.preventDefault();
    if (action !== "approve" && !message.trim())
      return toast.error("Explain what the vendor should change.");
    if (
      !confirm(
        action === "approve"
          ? "Approve this application? The vendor must publish their profile separately."
          : action === "reject"
            ? "Reject this application and notify the vendor with this reason?"
            : "Send this request to the vendor? They can update and resubmit.",
      )
    )
      return;
    setBusy(true);
    try {
      const result = await api.patch(
        `/admin/vendors/applications/${id}/${action}`,
        action === "reject"
          ? { reason: message }
          : action === "request-information"
            ? { message }
            : {},
      );
      if (applicationId.current !== id) return;
      toast.success("Review decision saved.");
      if (result.data.notification !== "SENT")
        toast.warning(
          "Decision saved, but email was not confirmed. Check the history and retry if needed.",
        );
      setMessage("");
      await load();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Decision could not be saved. Your message is kept.",
      );
      if (err.response?.status === 409) await load();
    } finally {
      if (applicationId.current === id) setBusy(false);
    }
  }
  async function saveNote(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.post(`/admin/vendors/applications/${id}/notes`, { note });
      if (applicationId.current !== id) return;
      setNote("");
      toast.success("Private note saved.");
      await load();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Note could not be saved. Your text is kept.",
      );
    } finally {
      if (applicationId.current === id) setBusy(false);
    }
  }
  async function retryEmail(eventId: string) {
    setBusy(true);
    try {
      const result = await api.post(
        `/admin/vendors/applications/${id}/notifications/${eventId}/retry`,
      );
      result.data.notification === "SENT"
        ? toast.success("Email accepted for sending.")
        : toast.warning(
            "Email not sent. Check email settings or whether the application has changed.",
          );
      await load();
    } catch {
      toast.error("Could not retry email.");
    } finally {
      setBusy(false);
    }
  }
  if (!error && (!data || data.application.id !== id))
    return <p role="status">Loading application…</p>;
  if (error || !data)
    return (
      <div role="alert" className="space-y-4 rounded-2xl border bg-white p-8">
        <Link href="/admin/vendors/approvals" className="underline">
          Back to applications
        </Link>
        <p>
          Application details could not load. Your unsaved notes and messages
          are kept.
        </p>
        <Button onClick={load}>Try again</Button>
      </div>
    );
  const app = data.application;
  const reviewable = ["PENDING", "UNDER_REVIEW"].includes(app.vendorStatus);
  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <Link
        href="/admin/vendors/approvals"
        className="inline-flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>
      <header className="rounded-2xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-teal-700">
              Application review
            </p>
            <h1 className="mt-2 break-words text-3xl font-semibold">
              {app.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {app.category?.name} ·{" "}
              {[app.city, app.district].filter(Boolean).join(", ")}
            </p>
          </div>
          <WaitingBadge application={app} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs">
          <span className="rounded-full bg-slate-100 px-3 py-2">
            {statusLabel(app.vendorStatus)}
          </span>
          <span className="rounded-full border px-3 py-2">
            {app.status === "ACTIVE"
              ? "Public profile published"
              : "Public profile not published"}
          </span>
          <span className="px-2 py-2 text-slate-500">
            Submitted {reviewDate(app.submittedAt || app.createdAt)} · Sri Lanka
            time
          </span>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Approval and publication are separate. Approval does not automatically
          grant a Verified badge.
        </p>
        <a
          href="#review-decision"
          className="mt-4 inline-flex rounded-lg border px-4 py-2 text-sm text-teal-800 xl:hidden"
        >
          Jump to review decision
        </a>
      </header>
      {loading && <p role="status">Refreshing review details…</p>}
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]">
        <div className="min-w-0 space-y-6">
          <section className="space-y-5 rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">
              Business & contact details
            </h2>
            <p className="whitespace-pre-wrap break-words text-sm text-slate-600">
              {app.description || "No business introduction provided."}
            </p>
            <Fields
              values={{
                "Business email": app.email,
                "Business phone": app.phone,
                Address: app.address,
                City: app.city,
                District: app.district,
                Province: app.province,
                "Postal code": app.zipCode,
                Country: app.country,
                Website: app.website,
                Facebook: app.facebook,
                Instagram: app.instagram,
                YouTube: app.youtube,
                "Map location": app.googleMapLocation,
              }}
            />
          </section>
          <section className="space-y-4 rounded-2xl border bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5 text-teal-700" />
              Vendor account
            </h2>
            <Fields
              values={{
                Vendor: `${app.vendor.firstName} ${app.vendor.lastName}`,
                Email: app.vendor.email,
                Phone: app.vendor.phone,
                "Account status": app.vendor.status,
                "Email verified": app.vendor.emailVerified ? "Yes" : "No",
                "Business verification badge": app.isVerified
                  ? "Verified — check supporting evidence"
                  : "Not verified",
              }}
            />
          </section>
          <section className="space-y-4 rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Photos & gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FilePreview url={app.logo} label="Business logo" image />
              <FilePreview url={app.coverImage} label="Cover photo" image />
              {app.galleries.map((item, i) => (
                <FilePreview
                  key={item.id}
                  url={item.url}
                  label={`Gallery ${item.type === "VIDEO" ? "video" : "photo"} ${i + 1}`}
                  image={item.type === "IMAGE"}
                />
              ))}
            </div>
          </section>
          <section className="space-y-4 rounded-2xl border bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-teal-700" />
              Supporting documents
            </h2>
            <p className="text-xs text-slate-500">
              Inspect supporting evidence before approval. Opening a document
              does not mark it verified.
            </p>
            {!app.documents.length && !app.verificationDocs && (
              <p className="text-sm text-slate-500">No documents uploaded.</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {app.verificationDocs && (
                <FilePreview
                  url={app.verificationDocs}
                  label="Legacy verification document"
                />
              )}
              {app.documents.map((doc) => (
                <div key={doc.id} className="space-y-2">
                  <p className="text-xs text-slate-500">
                    {doc.type} · {doc.status}
                  </p>
                  <FilePreview
                    url={doc.url}
                    label={doc.type.replace(/_/g, " ")}
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-4 rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Services & prices</h2>
            {!app.packages.length && (
              <p className="text-sm text-slate-500">
                No service cards added yet. Vendors can complete these after
                approval.
              </p>
            )}
            <div className="space-y-4">
              {app.packages.map((item) => (
                <article key={item.id} className="rounded-xl border p-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {Number(item.price) > 0
                      ? `LKR ${Number(item.price).toLocaleString("en-LK")}`
                      : "Price on request"}{" "}
                    · {item.duration || "No duration specified"} · {item.status}
                  </p>
                  <p className="my-3 whitespace-pre-wrap text-sm">
                    {item.description || "No description provided."}
                  </p>
                  {item.image && (
                    <FilePreview
                      url={item.image}
                      label={`${item.name} image`}
                      image
                    />
                  )}
                  <ul className="mt-3 list-inside list-disc text-sm text-slate-600">
                    {item.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
          <section className="space-y-4 rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">
              Business policies & additional content
            </h2>
            <Fields
              values={{
                "Booking policy": app.profileSettings?.policies?.bookingPolicy,
                "Cancellation policy":
                  app.profileSettings?.policies?.cancellationPolicy,
                "Payment policy": app.profileSettings?.policies?.paymentPolicy,
              }}
            />
            {Array.isArray(app.profileSettings?.faqs) &&
              app.profileSettings.faqs.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-medium">Frequently asked questions</h3>
                  <ReviewContent value={app.profileSettings.faqs} />
                </div>
              )}
            {Array.isArray(app.profileSettings?.hours) &&
              app.profileSettings.hours.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-medium">Business hours</h3>
                  <ReviewContent value={app.profileSettings.hours} />
                </div>
              )}
            {app.contentSections.map((section) => (
              <div key={section.id} className="border-t pt-3">
                <h3 className="font-medium">
                  {section.title}{" "}
                  <span className="text-xs text-slate-500">
                    ({section.status})
                  </span>
                </h3>
                {section.description && (
                  <p className="my-2 whitespace-pre-wrap text-sm">
                    {section.description}
                  </p>
                )}
                {section.imageUrl && (
                  <FilePreview
                    url={section.imageUrl}
                    label={section.title || "Content image"}
                    image
                  />
                )}
                <ReviewContent value={section.content} />
              </div>
            ))}
          </section>
        </div>
        <aside className="min-w-0 space-y-6">
          <section
            id="review-decision"
            className="scroll-mt-20 rounded-2xl border border-teal-200 bg-white p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CheckCircle2 className="h-5 w-5 text-teal-700" />
              Review decision
            </h2>
            {reviewable ? (
              <form onSubmit={decide} className="mt-4 space-y-4">
                <label className="block text-sm font-medium">
                  Choose an action
                  <select
                    aria-label="Review action"
                    value={action}
                    disabled={busy || loading}
                    onChange={(e) => setAction(e.target.value)}
                    className="mt-2 w-full rounded-xl border p-3 text-sm"
                  >
                    <option value="request-information">
                      Request more information
                    </option>
                    <option value="approve">Approve application</option>
                    <option value="reject">Reject application</option>
                  </select>
                </label>
                {action === "approve" ? (
                  <p className="rounded-xl bg-teal-50 p-4 text-sm text-teal-900">
                    This approves the application only. The vendor must complete
                    setup and publish their profile separately.
                  </p>
                ) : (
                  <label className="block text-sm font-medium">
                    {action === "reject"
                      ? "Reason sent to the vendor"
                      : "What should the vendor provide?"}
                    <Textarea
                      aria-label="Vendor message"
                      required
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-2 min-h-32"
                      placeholder="List the missing details clearly…"
                    />
                    <span className="mt-2 block text-xs font-normal text-slate-500">
                      Visible to the vendor in their dashboard and emailed to
                      their account address.
                    </span>
                  </label>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={busy || loading}
                >
                  {busy
                    ? "Saving…"
                    : action === "approve"
                      ? "Approve application"
                      : action === "reject"
                        ? "Reject application"
                        : "Request more information"}
                </Button>
              </form>
            ) : (
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  {app.vendorStatus === "NEEDS_INFO"
                    ? "Waiting for the vendor to update and resubmit. Review actions become available after resubmission."
                    : "This application is not awaiting a decision."}
                </p>
                {(app.informationRequest || app.rejectionReason) && (
                  <p className="whitespace-pre-wrap rounded-xl bg-amber-50 p-4">
                    {app.informationRequest || app.rejectionReason}
                  </p>
                )}
              </div>
            )}
          </section>
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <MessageSquare className="h-5 w-5 text-slate-500" />
              Internal reviewer note
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Only administrators can see these notes. They are never emailed or
              shown to vendors.
            </p>
            <form onSubmit={saveNote} className="mt-4 space-y-3">
              <Textarea
                aria-label="Private reviewer note"
                required
                maxLength={2000}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Record checks, concerns or follow-up…"
                className="min-h-28"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={busy || loading || !note.trim()}
              >
                Save private note
              </Button>
            </form>
          </section>
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Decision history</h2>
            <p className="mt-2 text-xs text-slate-500">
              Detailed records start with this release. Earlier recorded actions
              remain available in{" "}
              <Link className="underline" href="/admin/activity">
                Activity History
              </Link>
              .
            </p>
            <ol className="mt-5 space-y-5">
              {data.history.items.map((event) => (
                <li key={event.id} className="border-l-2 border-teal-100 pl-4">
                  <h3 className="text-sm font-semibold">
                    {titles[event.action] || event.action}
                  </h3>
                  <p className="mt-1 break-words text-xs text-slate-500">
                    {event.actorName} · {reviewDate(event.createdAt)}
                  </p>
                  {event.message && (
                    <p className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-sm">
                      {event.message}
                    </p>
                  )}
                  {event.notificationStatus !== "NOT_REQUIRED" && (
                    <div className="mt-2 text-xs text-slate-500">
                      <p>
                        {event.notificationStatus === "SENT"
                          ? "Email accepted by provider"
                          : `Email: ${event.notificationStatus.toLowerCase()}`}
                      </p>
                      {["FAILED", "PENDING", "SENDING"].includes(
                        event.notificationStatus,
                      ) && (
                        <button
                          className="mt-2 text-teal-800 underline"
                          disabled={busy || loading}
                          onClick={() => retryEmail(event.id)}
                        >
                          Retry email notification
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
            {!data.history.items.length && (
              <p className="mt-4 text-sm text-slate-500">
                No recorded decisions or notes yet.
              </p>
            )}
            <div className="mt-5 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={busy || loading || historyPage === 1}
                onClick={() => setHistoryPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-500">
                {data.history.total} entries
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  busy || loading || historyPage * 25 >= data.history.total
                }
                onClick={() => setHistoryPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
