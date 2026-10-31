"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { whatsappUrl } from "@/lib/whatsapp";
import { invitationTemplates } from "@/lib/invitation-templates";
export function InvitationCatalogue() {
  const [phone, setPhone] = useState("");
  useEffect(() => {
    const abort = new AbortController();
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/public/invitations/catalogue`,
      { signal: abort.signal, cache: "no-store" },
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => setPhone(v?.orderPhone || ""))
      .catch(() => {});
    return () => abort.abort();
  }, []);
  return (
    <div className="min-h-screen bg-[#f8f5ed]">
      <Navbar solid simple />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-36">
        <header className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[.2em] text-amber-800">
            An invitation to your forever
          </p>
          <h1 className="mt-4 text-5xl sm:text-6xl font-serif text-[#354332]">
            A beautiful beginning,
            <br />
            <em>made just for you.</em>
          </h1>
          <p className="mt-5 leading-7 text-stone-600">
            Choose a design. Send us your details on WhatsApp. We create your
            invitation, you approve it, and we give you a link to share with
            everyone you love.
          </p>
        </header>
        <div className="space-y-10">
          {invitationTemplates.map((template) => {
            const order = whatsappUrl(
              phone,
              `Hi! I would like ${template.id} — ${template.name}, LKR ${template.price.toLocaleString("en-LK")}. Please help me personalise my wedding invitation.`,
            );
            const sinhala = template.id === "W02";
            return (
              <article
                key={template.id}
                className="grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm md:grid-cols-2"
              >
                <Link
                  href={template.demo}
                  className="relative min-h-[420px] bg-[#424738]"
                >
                  <img
                    src={template.image}
                    alt={`${template.id} — ${template.name} invitation design`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 flex flex-col items-center ${sinhala ? "justify-end pb-5" : "justify-center bg-black/25"} p-8 text-center text-[#fff5da]`}
                  >
                    {!sinhala && (
                      <>
                        <p className="text-xs tracking-widest">
                          W01 · OLIVE & IVORY
                        </p>
                        <p className="my-8 text-5xl font-serif italic">
                          Your names.
                          <br />
                          Your forever.
                        </p>
                      </>
                    )}
                    <span className="rounded-full border border-white/60 px-6 py-3 text-sm">
                      Open live demo ↗
                    </span>
                  </div>
                </Link>
                <div className="p-7 sm:p-12">
                  <p className="text-xs uppercase tracking-widest text-amber-800">
                    {sinhala ? "Sinhala invitation" : "Advanced invitation"} ·{" "}
                    {template.id}
                  </p>
                  <h2
                    lang={sinhala ? "si" : "en"}
                    className="mt-3 text-4xl font-serif leading-relaxed"
                  >
                    {template.name}
                  </h2>
                  <p className="my-5 text-2xl font-semibold text-[#354332]">
                    LKR {template.price.toLocaleString("en-LK")}
                  </p>
                  <ul className="space-y-3 text-sm text-stone-600">
                    <li>
                      ♡{" "}
                      {sinhala
                        ? "Sinhala wording, lotus seal & traditional colours"
                        : "Floral envelope opening"}
                    </li>
                    <li>♡ Your names, photo & wedding details</li>
                    <li>♡ Countdown, directions & WhatsApp RSVP</li>
                    <li>
                      ♡{" "}
                      {sinhala
                        ? "Optional story & photo gallery"
                        : "Optional story, gallery & gentle music"}
                    </li>
                    <li>
                      ♡{" "}
                      {sinhala
                        ? "Printable invitation"
                        : "Matching downloadable invitation card"}
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      className="inline-flex min-h-12 items-center rounded-xl border px-5 text-sm font-semibold"
                      href={template.demo}
                    >
                      View demo
                    </Link>
                    {order ? (
                      <a
                        className="inline-flex min-h-12 items-center rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white"
                        href={order}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Choose on WhatsApp ↗
                      </a>
                    ) : (
                      <Link
                        className="inline-flex min-h-12 items-center rounded-xl bg-emerald-800 px-5 text-sm text-white"
                        href="/contact"
                      >
                        Contact us to order
                      </Link>
                    )}
                  </div>
                  <p className="mt-5 text-xs leading-6 text-stone-500">
                    Our team personalises this design for you. No account or
                    online checkout needed. Confirm delivery time, revisions and
                    hosting period with us before ordering.
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-8 text-sm text-stone-500">
          More designs, including simple invitations, are coming soon.
        </p>
      </main>
      <Footer />
    </div>
  );
}
