"use client";

import { MessageCircle } from "lucide-react";
import { ShortlistButton } from "@/components/discovery/ShortlistButton";
import { whatsappEnquiryUrl } from "@/lib/whatsapp";

interface BusinessCTAProps {
  businessId: string;
  whatsapp?: string;
}

export function BusinessCTA({ businessId, whatsapp }: BusinessCTAProps) {
  const whatsappHref = whatsappEnquiryUrl(whatsapp);
  // Display the same normalized number used by the chat link.
  const number = whatsappHref
    ? `+${new URL(whatsappHref).pathname.slice(1)}`
    : null;

  return (
    <>
      <section
        aria-label="Contact this vendor"
        className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl"
      >
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Contact this vendor</h2>
          <p className="mt-2 text-sm text-slate-500">
            Connect directly to discuss your event.
          </p>
        </div>
        {whatsappHref ? (
          <div className="mb-5 space-y-3">
            <p className="text-center text-sm text-slate-500">
              WhatsApp <span className="ml-1 font-semibold text-slate-900">{number}</span>
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-lg font-bold text-white transition-colors hover:bg-emerald-800"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>
        ) : (
          <p className="mb-5 text-center text-sm text-slate-500">
            WhatsApp contact is not available for this vendor yet.
          </p>
        )}
        <div className="flex justify-center border-t border-slate-100 pt-5">
          <ShortlistButton businessId={businessId} />
        </div>
      </section>
      {whatsappHref && (
        <div
          aria-label="Quick contact"
          className="fixed inset-x-0 bottom-0 z-40 flex border-t border-stone-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur lg:hidden"
        >
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" /> Chat on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
