"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  Globe,
  Camera,
  MessageCircle,
  Briefcase,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

type FooterContent = {
  description?: string;
  copyright?: string;
  subtext?: string;
  socials?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
};

const linkGroups = [
  {
    title: "Explore",
    links: [
      ["Categories", "/#categories"],
      ["Vendors", "/search"],
      ["Packages", "/#packages"],
      ["Locations", "/locations"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Become a Vendor", "/vendor/register"],
      ["Careers", "/careers"],
      ["Blog", "/blog"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Support",
    links: [
      ["FAQ", "/faq"],
      ["Terms of Service", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["Trust & Safety", "/trust"],
    ],
  },
];

export function Footer() {
  const [cms, setCms] = useState<FooterContent | null>(null);
  useEffect(() => {
    let active = true;
    async function getFooterSettings() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/admin/cms/public/settings/FOOTER_CONTENT`,
        );
        if (res.ok) {
          const data = await res.json();
          if (active) setCms(data.value ?? data);
        }
      } catch {
        /* Original footer copy remains available when CMS is offline. */
      }
    }
    void getFooterSettings();
    return () => {
      active = false;
    };
  }, []);

  const description =
    cms?.description ||
    "Find the people and places that make your celebration special. Explore wedding venues and event professionals across Sri Lanka, all in one place.";
  const copyright =
    cms?.copyright ||
    `© ${new Date().getFullYear()} Nakathata.lk. All rights reserved.`;
  const subtext = cms?.subtext || "Weddings. Events. Everything together.";
  const socials = {
    website: "https://nakathata.lk",
    instagram: "https://www.instagram.com/nakathata.lk/",
    facebook: "https://web.facebook.com/profile.php?id=61595001868271",
    linkedin: "",
    ...cms?.socials,
  };
  const socialLinks = [
    { label: "Visit our website", href: socials.website, icon: Globe },
    {
      label: "Follow Nakathata on Instagram",
      href: socials.instagram,
      icon: Camera,
    },
    {
      label: "Follow Nakathata on Facebook",
      href: socials.facebook,
      icon: MessageCircle,
    },
    {
      label: "Follow Nakathata on LinkedIn",
      href: socials.linkedin,
      icon: Briefcase,
    },
  ].filter((link) => link.href && /^https?:\/\//i.test(link.href));

  return (
    <footer className="relative bg-[#faf8f3] text-slate-600 border-t border-[#e9e2d3] pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section
          aria-labelledby="footer-newsletter-title"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 shadow-xl shadow-slate-900/10"
        >
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-32 w-80 h-80 rounded-full border border-primary/20 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -right-2 -top-16 w-48 h-48 rounded-full border border-primary/10 pointer-events-none"
          />
          <div className="relative grid lg:grid-cols-[1fr_0.9fr] items-center gap-6 lg:gap-12">
            <div>
              <p className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-amber-300 mb-3">
                <Sparkles className="h-4 w-4 shrink-0" />A little inspiration
                for your big day
              </p>
              <h2
                id="footer-newsletter-title"
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-3"
              >
                Make every celebration special.
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 max-w-md">
                Wedding ideas, planning tips, and fresh inspiration—delivered to
                your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.7fr_1fr_1fr_1fr] gap-x-6 gap-y-10 lg:gap-12 pb-10 sm:pb-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              aria-label="Nakathata.lk home"
              className="inline-flex bg-white rounded-2xl border border-[#ece5d7] p-3 shadow-sm mb-5 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
            >
              <BrandLogo className="w-36 sm:w-40 rounded-none" />
            </Link>
            <p className="text-sm leading-7 max-w-sm mb-5">{description}</p>
            <p className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-5">
              <MapPin className="h-4 w-4 text-amber-700" />
              Celebrating across Sri Lanka
            </p>
            <div
              className="flex flex-wrap gap-2.5"
              aria-label="Social media links"
            >
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl border border-[#e5decf] bg-white flex items-center justify-center text-slate-600 hover:border-primary hover:bg-primary/10 hover:text-amber-800 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={`Footer ${group.title}`}>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-900 mb-5">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-1 py-2 text-sm hover:text-amber-800 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm"
                    >
                      {label}
                      {label === "Become a Vendor" && (
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-amber-700"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-[#e5decf] pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs leading-6 text-slate-500">
          <p>{copyright}</p>
          <p className="font-medium text-slate-600">{subtext}</p>
        </div>
      </div>
    </footer>
  );
}
