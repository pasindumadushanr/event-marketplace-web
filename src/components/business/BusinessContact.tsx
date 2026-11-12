"use client";
import { Phone, Mail, Globe, Play } from "lucide-react";
import { whatsappEnquiryUrl } from "@/lib/whatsapp";
import { publicContactUrl } from "@/lib/vendor-contact";
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";

interface BusinessContactProps {
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}
const socials = [
  { field: "facebook", label: "Facebook", Icon: Globe },
  { field: "instagram", label: "Instagram", Icon: InstagramIcon },
  { field: "youtube", label: "YouTube", Icon: Play },
  { field: "tiktok", label: "TikTok", Icon: TikTokIcon },
] as const;

export function BusinessContact({ contact }: BusinessContactProps) {
  const whatsappHref = whatsappEnquiryUrl(contact.whatsapp);
  const website = publicContactUrl(contact.website);
  return (
    <section
      className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/60 p-5 shadow-sm sm:p-6"
      aria-label="Vendor contact and social media"
    >
      <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">
        Contact this vendor
      </h3>
      <p className="text-sm text-slate-500 mb-5">
        Connect directly to discuss your event.
      </p>
      {whatsappHref && (
        <a
          href={whatsappHref}
          aria-label="Contact vendor on WhatsApp (opens outside Nakathata.lk)"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-5 flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#128c50] px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#0d7040] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          <WhatsAppIcon className="h-6 w-6 shrink-0" /> Chat on WhatsApp
        </a>
      )}
      <div className="space-y-1">
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="flex min-h-11 items-center gap-3 text-sm text-slate-700 font-medium break-all"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex min-h-11 items-center gap-3 text-sm text-slate-700 font-medium break-all"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {contact.email}
          </a>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-3 font-medium text-slate-700"
          >
            <Globe className="h-4 w-4" /> Visit website
          </a>
        )}
      </div>
      {socials.some(({ field }) => publicContactUrl(contact[field], field)) && (
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-emerald-100 pt-5">
          {socials.map(({ field, label, Icon }) => {
            const href = publicContactUrl(contact[field], field);
            return href ? (
              <a
                key={field}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit vendor on ${label}`}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${field === "instagram" ? "border-pink-100 bg-pink-50 text-pink-800 hover:bg-pink-100" : field === "tiktok" ? "border-slate-800 bg-slate-900 text-white hover:bg-slate-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </a>
            ) : null;
          })}
        </div>
      )}
    </section>
  );
}
