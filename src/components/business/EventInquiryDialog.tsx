"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useLanguage, LanguageSwitch } from "@/lib/language";

export function EventInquiryDialog({
  open,
  onClose,
  businessId,
  businessName,
  listing,
}: {
  open: boolean;
  onClose: () => void;
  businessId: string;
  businessName?: string;
  listing?: { id: string; name: string };
}) {
  const [eventDate, setEventDate] = useState("");
  const { language, t } = useLanguage();
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [requirements, setRequirements] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const request = useRef({ key: "", id: "" });
  const router = useRouter();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const payload = {
      businessId,
      ...(listing ? { packageId: listing.id } : {}),
      eventDate,
      location: location.trim(),
      guestCount: Number(guests),
      requirements: requirements.trim(),
    };
    if (
      !eventDate ||
      eventDate < today ||
      payload.location.length < 2 ||
      payload.location.length > 250 ||
      !Number.isInteger(payload.guestCount) ||
      payload.guestCount < 1 ||
      payload.guestCount > 100000 ||
      payload.requirements.length < 10 ||
      payload.requirements.length > 3000
    ) {
      setError(
        "Add a future event date, location, guest count and at least 10 characters describing your requirements.",
      );
      return;
    }
    const key = JSON.stringify(payload);
    if (request.current.key !== key)
      request.current = { key, id: crypto.randomUUID() };
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/chat/inquiries", {
        ...payload,
        requestId: request.current.id,
      });
      router.push(
        `/account/messages?conversation=${encodeURIComponent(data.conversationId)}`,
      );
      onClose();
      setEventDate("");
      setLocation("");
      setGuests("");
      setRequirements("");
      request.current = { key: "", id: "" };
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(
        language === "en" && typeof message === "string"
          ? message
          : "Your enquiry wasn’t sent. Your details are still here; please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !busy) onClose();
      }}
    >
      <DialogContent
        lang={language}
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
      >
        <LanguageSwitch disabled={busy} />
        <DialogHeader>
          <DialogTitle>{t("Tell us about your event")}</DialogTitle>
          <DialogDescription>
            {t("Send an enquiry to {vendor}", {
              vendor: businessName || t("this vendor"),
            })}
            {listing
              ? ` ${t("about {listing}", { listing: listing.name })}`
              : ""}
            . {t("This does not make a booking or reserve your date.")}
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={submit} className="mt-3 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              {t("Event date")}
              <input
                disabled={busy}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal"
                type="date"
                required
                min={today}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              {t("Guest count")}
              <input
                disabled={busy}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal"
                type="number"
                required
                min="1"
                max="100000"
                step="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="e.g. 150"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            {t("Event location")}
            <input
              disabled={busy}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal"
              required
              maxLength={250}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("Venue, city or area")}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            {t("Your requirements")}
            <textarea
              disabled={busy}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal"
              required
              minLength={10}
              maxLength={3000}
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={t(
                "Tell the vendor what you need, your preferences and any important details.",
              )}
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {t(error)}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={onClose}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={busy}>
              {t(busy ? "Sending…" : "Send enquiry")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
