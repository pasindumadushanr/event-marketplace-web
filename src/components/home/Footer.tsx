"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  Globe,
  Camera,
  MessageCircle,
  Briefcase,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import "./footer.css";

function WeddingSprig({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 320"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M24 308C68 250 82 184 138 126S193 55 202 16"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M63 244C21 243 15 211 25 184C57 190 74 216 63 244Z" />
        <path d="M77 215C121 220 144 197 146 170C108 167 79 184 77 215Z" />
        <path d="M97 178C59 170 55 141 67 118C97 130 107 153 97 178Z" />
        <path d="M130 134C165 143 193 125 202 99C169 90 140 103 130 134Z" />
        <path d="M161 96C131 87 122 63 132 40C158 48 171 71 161 96Z" />
        <path d="M183 63C214 70 234 49 232 28C207 22 188 36 183 63Z" />
      </g>
      <g fill="currentColor">
        <circle cx="48" cy="273" r="3" />
        <circle cx="117" cy="153" r="2.5" />
        <circle cx="179" cy="79" r="2.5" />
      </g>
    </svg>
  );
}

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
    <footer className="wedding-footer relative overflow-hidden text-[#655b58] pt-10 sm:pt-14 pb-6">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="wedding-footer-ornament">
          <span />
          <Heart className="h-4 w-4" />
          <span />
        </div>
        <WeddingSprig className="wedding-footer-sprig wedding-footer-sprig-left" />
        <WeddingSprig className="wedding-footer-sprig wedding-footer-sprig-right" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-x-8 gap-y-9 lg:gap-12 pb-9 sm:pb-12">
          <div className="wedding-footer-brand col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              aria-label="Nakathata.lk home"
              className="inline-flex mb-5 rounded-xl focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
            >
              <BrandLogo className="w-32 sm:w-36" />
            </Link>
            <p className="text-sm leading-7 max-w-sm mb-5">{description}</p>
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
                  className="wedding-footer-social h-11 w-11 rounded-full flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={`Footer ${group.title}`}>
              <h3 className="wedding-footer-heading text-xs font-bold uppercase tracking-[0.18em] mb-5">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="wedding-footer-link group inline-flex items-center gap-1 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm"
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

        <div className="wedding-footer-bottom pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs leading-6 text-[#756862]">
          <p>{copyright}</p>
          <p className="flex items-center gap-2 font-medium text-[#785b56]">
            <Heart className="h-3.5 w-3.5 text-[#b37b79]" aria-hidden="true" />
            {subtext}
          </p>
        </div>
      </div>
    </footer>
  );
}
