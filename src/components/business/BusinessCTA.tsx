"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, FileText } from "lucide-react";
import { BookingMethod } from "@/types/business-profile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { EventInquiryDialog } from "./EventInquiryDialog";
import { ShortlistButton } from "@/components/discovery/ShortlistButton";
import { whatsappEnquiryUrl } from "@/lib/whatsapp";

interface BusinessCTAProps {
  businessId: string;
  bookingMethod: BookingMethod;
  startingPrice: number;
  whatsapp?: string;
}

export function BusinessCTA({
  businessId,
  bookingMethod,
  startingPrice,
  whatsapp,
}: BusinessCTAProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const whatsappHref = whatsappEnquiryUrl(whatsapp);
  function enquire() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setInquiryOpen(true);
  }
  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-primary/20">
        <div className="text-center mb-6 pb-6 border-b border-slate-100">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
            {startingPrice > 0 ? "Starting Price" : "Pricing"}
          </p>
          <p className="text-3xl font-extrabold text-slate-900">
            {startingPrice > 0
              ? `LKR ${startingPrice.toLocaleString()}`
              : "Custom Quote"}
          </p>
        </div>
        <div className="space-y-4">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full min-h-14 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-lg"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
          )}
          <Button
            onClick={enquire}
            className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
          >
            <FileText className="mr-2 h-5 w-5" />{" "}
            {bookingMethod === "CONTACT_ONLY"
              ? "Contact Vendor"
              : "Request a Quote"}
          </Button>
          <p className="text-xs text-center text-slate-500">
            Discuss availability and booking terms directly with the vendor.
            Online payments are not available.
          </p>
          <Button
            variant="outline"
            onClick={enquire}
            className="w-full min-h-12 rounded-xl"
          >
            <MessageCircle className="mr-2 h-5 w-5" /> Message Vendor
          </Button>
          <ShortlistButton businessId={businessId} />
        </div>
      </div>
      <EventInquiryDialog
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        businessId={businessId}
      />
      {!inquiryOpen && (
        <div
          aria-label="Quick contact"
          className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-stone-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur lg:hidden"
        >
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
          )}
          <Button
            onClick={enquire}
            className="min-h-12 flex-1 rounded-xl bg-slate-900 text-white"
          >
            <MessageCircle className="mr-2 h-5 w-5" /> Message
          </Button>
        </div>
      )}
    </>
  );
}
