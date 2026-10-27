"use client";
import {
  Phone,
  Mail,
  Globe,
  Camera,
  Play,
  Music2,
  MessageCircle,
} from "lucide-react";
import { whatsappEnquiryUrl } from "@/lib/whatsapp";
import { publicContactUrl } from "@/lib/vendor-contact";

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
  { field: "instagram", label: "Instagram", Icon: Camera },
  { field: "youtube", label: "YouTube", Icon: Play },
  { field: "tiktok", label: "TikTok", Icon: Music2 },
] as const;

export function BusinessContact({ contact }: BusinessContactProps) {
  const whatsappHref = whatsappEnquiryUrl(contact.whatsapp);
  const website = publicContactUrl(contact.website);
  return (
    <section
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
      aria-label="Vendor contact and social media"
    >
      <h3 className="text-lg font-bold text-slate-900 mb-2">
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
          className="mb-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
        </a>
      )}
      <div className="space-y-4">
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-3 text-slate-700 font-medium break-all"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 text-slate-700 font-medium break-all"
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
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-5">
        {socials.map(({ field, label, Icon }) => {
          const href = publicContactUrl(contact[field], field);
          return href ? (
            <a
              key={field}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit vendor on ${label}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-100"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </a>
          ) : null;
        })}
      </div>
    </section>
  );
}
