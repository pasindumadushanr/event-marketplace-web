"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InquiryRecord,
  InquiryResponse,
  inquiryStatusLabel,
} from "@/lib/inquiry-record";
import api from "@/lib/api";

export function InquiryCard({
  inquiry,
  id,
  conversationId,
  response,
  vendorView,
  onResponse,
}: {
  inquiry: InquiryRecord;
  id: string;
  conversationId: string;
  response?: InquiryResponse;
  vendorView: boolean;
  onResponse: (message: any) => void;
}) {
  const [action, setAction] = useState<InquiryResponse["action"] | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const request = useRef({ key: "", id: "" });
  const status = response?.action || "NEW";
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!action || !text.trim() || busy) return;
    const key = `${action}:${text.trim()}`;
    if (request.current.key !== key)
      request.current = { key, id: crypto.randomUUID() };
    setBusy(true);
    setError("");
    try {
      const result = await api.post(
        `/chat/conversations/${conversationId}/inquiries/${id}/respond`,
        { action, text: text.trim(), requestId: request.current.id },
      );
      onResponse(result.data);
      setAction(null);
      setText("");
      request.current = { key: "", id: "" };
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(
        typeof message === "string"
          ? message
          : "Your response wasn’t sent. Your message is still here; try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function choose(value: InquiryResponse["action"]) {
    if (!busy) {
      setAction(value);
      setError("");
      setText(
        value === "NEEDS_DETAILS" ? "Could you share more details about " : "",
      );
    }
  }
  return (
    <article
      className="w-full rounded-2xl border border-[#dce5db] bg-white p-4 sm:p-5"
      aria-label="Event enquiry"
    >
      <div className="flex flex-wrap justify-between gap-2">
        <h4 className="font-semibold text-[#183e38]">
          {inquiry.listingName || "Event enquiry"}
        </h4>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${status === "DECLINED" ? "bg-rose-50 text-rose-700" : status === "NEEDS_DETAILS" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}
        >
          {inquiryStatusLabel[status]}
        </span>
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">Event date</dt>
          <dd className="mt-1 font-medium">{inquiry.eventDate}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Location</dt>
          <dd className="mt-1 break-words font-medium">{inquiry.location}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Guests</dt>
          <dd className="mt-1 font-medium">
            {inquiry.guestCount.toLocaleString()}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs font-medium text-slate-500">Requirements</p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
        {inquiry.requirements}
      </p>
      {status === "DECLINED" ? (
        <p className="mt-4 text-xs text-slate-600">
          This enquiry was declined. The conversation remains available; a new
          event can be submitted as a new enquiry.
        </p>
      ) : vendorView ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => choose("REPLIED")}
          >
            Reply
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => choose("NEEDS_DETAILS")}
          >
            Request more details
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => choose("DECLINED")}
          >
            Decline
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-600">
          {status === "NEEDS_DETAILS"
            ? "The vendor needs more information. Reply below with the requested details."
            : "This is an enquiry, not a confirmed booking. Discuss availability with the vendor."}
        </p>
      )}
      {action && status !== "DECLINED" && (
        <form onSubmit={submit} className="mt-4 space-y-3 border-t pt-4">
          <label className="block text-sm font-medium">
            {action === "REPLIED"
              ? "Your reply"
              : action === "NEEDS_DETAILS"
                ? "What details do you need?"
                : "Reason for declining"}
            <textarea
              autoFocus
              disabled={busy}
              required
              maxLength={2000}
              rows={3}
              className="mt-2 w-full rounded-xl border p-3 text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                action === "DECLINED"
                  ? "Explain politely why you cannot help with this event."
                  : "Write your message to the customer…"
              }
            />
          </label>
          {action === "DECLINED" && (
            <p className="text-xs text-slate-500">
              Declining affects only this enquiry. It does not cancel existing
              bookings.
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy || !text.trim()} size="sm">
              {busy
                ? "Sending…"
                : action === "DECLINED"
                  ? "Send decline"
                  : action === "NEEDS_DETAILS"
                    ? "Send request for details"
                    : "Send reply"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => setAction(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </article>
  );
}
