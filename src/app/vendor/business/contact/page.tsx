"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { Save, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import { toast } from "sonner";
import api from "@/lib/api";
import { whatsappUrl, whatsappEnquiryUrl } from "@/lib/whatsapp";
import {
  publicContactUrl,
  vendorWhatsappValue,
  type SocialField,
} from "@/lib/vendor-contact";

interface ContactValues {
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
}
interface ContactBusiness {
  id: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  profileSettings?: {
    whatsapp?: string;
    tiktok?: string;
    contact?: { whatsapp?: string };
  };
}
const links: { field: SocialField; label: string; placeholder: string }[] = [
  {
    field: "website",
    label: "Website",
    placeholder: "https://yourbusiness.lk",
  },
  {
    field: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    field: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourbusiness",
  },
  {
    field: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourbusiness",
  },
  {
    field: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
  },
];
export default function ContactSettingsPage() {
  const { business, updateBusinessLocally } = useBusinessProfile();
  return business ? (
    <ContactForm
      key={business.id}
      business={business}
      onSaved={updateBusinessLocally}
    />
  ) : null;
}
function ContactForm({
  business,
  onSaved,
}: {
  business: ContactBusiness;
  onSaved: (data: unknown) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ContactValues>(() => ({
    phone: business.phone || "",
    email: business.email || "",
    whatsapp: vendorWhatsappValue(business.profileSettings),
    website: business.website || "",
    facebook: business.facebook || "",
    instagram: business.instagram || "",
    youtube: business.youtube || "",
    tiktok: business.profileSettings?.tiktok || "",
  }));
  const preview = whatsappEnquiryUrl(form.whatsapp);
  function change(field: keyof ContactValues, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const normalised = { ...form };
    const numberLink = whatsappUrl(form.whatsapp);
    if (form.whatsapp.trim() && !numberLink) {
      toast.error("Enter a valid WhatsApp number, e.g. +94771234567");
      return;
    }
    normalised.whatsapp = numberLink
      ? new URL(numberLink).pathname.slice(1)
      : "";
    for (const { field, label } of links) {
      const href = publicContactUrl(form[field], field);
      if (form[field].trim() && !href) {
        toast.error(`Enter a valid ${label} link`);
        return;
      }
      normalised[field] = href || "";
    }
    setSaving(true);
    try {
      const { whatsapp, tiktok, ...primary } = normalised;
      const payload = { ...primary, profileSettings: { whatsapp, tiktok } };
      await api.patch("/vendor/business", payload);
      onSaved(payload);
      setForm(normalised);
      toast.success("Contact and social links saved!");
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.message ||
              "Could not save your contact details. Please try again."
          : "Could not save your contact details. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <form onSubmit={save} className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Contact & social links
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Help customers reach you directly. These details are public. Clear a
          field to hide its button.
        </p>
      </div>
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6 space-y-4">
        <h3 className="flex items-center gap-2 font-semibold text-emerald-950">
          <MessageCircle className="h-5 w-5" /> WhatsApp enquiries
        </h3>
        <label
          htmlFor="vendor-whatsapp"
          className="block text-sm font-medium text-slate-700"
        >
          WhatsApp number
        </label>
        <Input
          id="vendor-whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.whatsapp}
          onChange={(event) => change("whatsapp", event.target.value)}
          placeholder="e.g. 0771234567 or +94771234567"
          aria-describedby="whatsapp-help"
          className="h-12 bg-white"
        />
        <p id="whatsapp-help" className="text-sm text-slate-600">
          Use a number registered with WhatsApp. Sri Lankan numbers are
          automatically formatted with +94. Customers can contact you without
          signing in.
        </p>
        {preview && (
          <a
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" /> Test your WhatsApp link{" "}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-5">
        <h3 className="font-semibold text-slate-900">Phone & email</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="vendor-phone"
              className="block mb-2 text-sm font-medium"
            >
              Phone number
            </label>
            <Input
              id="vendor-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(event) => change("phone", event.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <label
              htmlFor="vendor-email"
              className="block mb-2 text-sm font-medium"
            >
              Email address
            </label>
            <Input
              id="vendor-email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => change("email", event.target.value)}
              className="h-12"
            />
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-5">
        <h3 className="font-semibold text-slate-900">Website & social media</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {links.map(({ field, label, placeholder }) => (
            <div key={field}>
              <label
                htmlFor={`vendor-${field}`}
                className="mb-2 block text-sm font-medium"
              >
                {label}
              </label>
              <Input
                id={`vendor-${field}`}
                name={field}
                value={form[field]}
                onChange={(event) => change(field, event.target.value)}
                placeholder={placeholder}
                inputMode="url"
                className="h-12"
              />
            </div>
          ))}
        </div>
      </section>
      <div className="flex justify-end border-t border-stone-200 pt-5">
        <Button
          type="submit"
          disabled={saving}
          className="min-h-12 bg-emerald-800 px-6 text-white hover:bg-emerald-900"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save contact & social links"}
        </Button>
      </div>
    </form>
  );
}
