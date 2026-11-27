"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { whatsappUrl } from "@/lib/whatsapp";
import { birthdayTemplates, invitationTemplates, isClassicWedding } from "@/lib/invitation-templates";
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
            const sinhala = template.sinhala;
            const classic = isClassicWedding(template.id);
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
                    className={`absolute inset-0 h-full w-full ${classic ? "object-contain" : "object-cover"}`}
                  />
                  <div
                    className={`absolute inset-0 flex flex-col items-center ${sinhala || classic ? "justify-end pb-5" : "justify-center bg-black/25"} p-8 text-center text-[#fff5da]`}
                  >
                    {!sinhala && !classic && (
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
                    <span className="rounded-full border border-white/60 bg-stone-950/70 px-6 py-3 text-sm">
                      Open live demo ↗
                    </span>
                  </div>
                </Link>
                <div className="p-7 sm:p-12">
                  <p className="text-xs uppercase tracking-widest text-amber-800">
                    {classic ? "Classic invitation" : sinhala ? "Sinhala invitation" : "Advanced invitation"} ·{" "}
                    {template.id}
                  </p>
                  <h2
                    lang={template.id === "W02" ? "si" : "en"}
                    className="mt-3 text-4xl font-serif leading-relaxed"
                  >
                    {template.name}
                  </h2>
                  <p className="my-5 text-2xl font-semibold text-[#354332]">
                    LKR {template.price.toLocaleString("en-LK")}
                  </p>
                  <ul className="space-y-3 text-sm text-stone-600">
                    <li>♡ {template.accent}</li>
                    {classic ? <>
                      <li>♡ Opens directly to the wedding details</li>
                      <li>♡ Optional family names, verse & photos</li>
                      <li>♡ Directions & WhatsApp RSVP</li>
                    </> : <>
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
                    </>}
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
        <section className="mt-14 space-y-7" aria-labelledby="birthday-cards">
          <h2 id="birthday-cards" className="text-4xl font-serif text-[#354332]">Birthday wishes</h2>
          {birthdayTemplates.map((birthdayTemplate) => <article key={birthdayTemplate.id} className="grid overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm md:grid-cols-2">
          <Link href={birthdayTemplate.demo} className={`block min-h-64 ${birthdayTemplate.id === "B02" ? "bg-[#fcf2d8]" : "bg-[#f2d0c7]"}`}>
            <img src={birthdayTemplate.image} alt={`${birthdayTemplate.name} birthday card`} className={`h-full max-h-96 w-full ${birthdayTemplate.id === "B02" ? "object-contain p-7" : "object-cover"}`} />
          </Link>
          <div className="p-7 sm:p-12">
            <p className="text-xs uppercase tracking-widest text-amber-800">Birthday wishes · {birthdayTemplate.id}</p>
            <h3 className="mt-3 text-4xl font-serif">{birthdayTemplate.name}</h3>
            <p className="mt-4 text-sm leading-7 text-stone-600">{birthdayTemplate.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={birthdayTemplate.demo} className="inline-flex min-h-12 items-center rounded-xl border px-5 text-sm font-semibold">Try the birthday demo</Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white">Ask about a birthday card</Link>
            </div>
          </div>
          </article>)}
        </section>
      </main>
      <Footer />
    </div>
  );
}
