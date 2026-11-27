"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, CalendarDays, Clock3, Flower2, Leaf, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { InvitationContent } from "@/lib/invitations";
import type { ClassicWeddingId } from "@/lib/invitation-templates";
import { whatsappUrl } from "@/lib/whatsapp";
import styles from "./ClassicWeddingInvitation.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Colombo" });
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Colombo" });
const weekdayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "Asia/Colombo" });

function safeMap(raw: string) {
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" && !url.username && !url.password &&
      ["maps.google.com", "www.google.com", "google.com", "maps.app.goo.gl", "goo.gl"].includes(url.hostname))
      return url.href;
  } catch { /* An incomplete draft need not show a directions link. */ }
  return null;
}

function DateLine({ templateId, value }: { templateId: ClassicWeddingId; value: string }) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const time = timeFormat.format(date).toUpperCase();
  const dateText = dateFormat.format(date);
  if (templateId === "W07") {
    const parts = Object.fromEntries(dateFormat.formatToParts(date).map(({ type, value }) => [type, value]));
    return <time className={styles.calendar} dateTime={value}>
      <span className={styles.label}>{weekdayFormat.format(date)}</span>
      <strong><span>{parts.day}</span><span>{parts.month}</span><span>{parts.year}</span></strong>
      <span>{time}</span>
    </time>;
  }
  return <time className={styles.dateTiles} dateTime={value}>
    <span>{templateId === "W08" && <CalendarDays size={19} strokeWidth={1.35} aria-hidden="true" />}<span className={styles.label}>Date</span>{dateText}</span>
    <span>{templateId === "W08" && <Clock3 size={19} strokeWidth={1.35} aria-hidden="true" />}<span className={styles.label}>Time</span>{time}</span>
  </time>;
}

export function ClassicWeddingInvitation({ templateId, content, preview = false, demo = false }: {
  templateId: ClassicWeddingId;
  content: InvitationContent;
  preview?: boolean;
  demo?: boolean;
}) {
  const [showDemo, setShowDemo] = useState(false);
  const first = content.partnerOne || "First partner";
  const second = content.partnerTwo || "Second partner";
  const names = `${first} & ${second}`;
  const map = safeMap(content.mapUrl);
  const rsvp = whatsappUrl(content.rsvpPhone, `Hi ${names}! Thank you for the invitation.\n\nGuest name: \nAttending: Yes / No\nNumber of guests: `);
  const photos = [...new Set([content.couplePhoto, ...content.gallery].filter(Boolean))];
  const asset = `/invitation-assets/${templateId.toLowerCase()}/card.webp`;
  const ornament = templateId === "W08" ? <Flower2 size={30} strokeWidth={1.15} /> : templateId === "W09" ? <Leaf size={26} strokeWidth={1.15} /> : <span>✦</span>;

  return (
    <main className={styles.page} data-classic-wedding={templateId}>
      <div className={styles.shell}>
        <article className={styles.card} aria-label="Wedding invitation">
          <img className={styles.art} src={asset} alt="" width={960} height={1440} fetchPriority="high" />
          <div className={styles.copy}>
            <div className={styles.ornament} aria-hidden="true">{ornament}</div>
            {content.weddingVerse && <blockquote className={styles.verse} dir="auto">{content.weddingVerse}</blockquote>}
            <p className={styles.label}>Together with their families</p>
            <h1 className={styles.names}>
              <span><bdi>{first}</bdi>{content.familyOne && <small dir="auto">{content.familyOne}</small>}</span>
              <i>&amp;</i>
              <span><bdi>{second}</bdi>{content.familyTwo && <small dir="auto">{content.familyTwo}</small>}</span>
            </h1>
            <div className={styles.rule} aria-hidden="true">✧</div>
            {content.welcome && <p className={styles.welcome} dir="auto">{content.welcome}</p>}
            <DateLine templateId={templateId} value={content.weddingAt} />
            {(content.venue || content.address) && <div className={styles.venue}>
              {templateId === "W08" && <MapPin size={17} strokeWidth={1.45} aria-hidden="true" />}
              <strong dir="auto">{content.venue}</strong>
              <p dir="auto">{content.address}</p>
            </div>}
          </div>
        </article>

        <section className={styles.actions} aria-labelledby="classic-actions">
          <h2 id="classic-actions">Join the celebration</h2>
          <div>
            {map && <a href={map} className={styles.button} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15} aria-hidden="true" /></a>}
            {demo || preview ? (
              <button className={styles.primary} type="button" onClick={() => setShowDemo(true)}><MessageCircle size={16} aria-hidden="true" /> Try RSVP</button>
            ) : rsvp ? (
              <a className={styles.primary} href={rsvp} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" /> RSVP on WhatsApp</a>
            ) : null}
          </div>
          {showDemo && <p role="status">The published invitation opens WhatsApp with a reply you can edit. This preview does not send a message.</p>}
        </section>

        {(content.story || photos.length > 0) && <section className={styles.story}>
          <h2>Our story</h2>
          {content.story && <p dir="auto">{content.story}</p>}
          {photos.length > 0 && <div className={styles.gallery}>
            {photos.map((photo, index) => <img key={photo} src={photo} alt={`${names} — photo ${index + 1}`} loading="lazy" referrerPolicy="no-referrer" />)}
          </div>}
        </section>}
        {demo && <p className={styles.demo}>Template demo · Sample wedding details</p>}
      </div>
    </main>
  );
}
