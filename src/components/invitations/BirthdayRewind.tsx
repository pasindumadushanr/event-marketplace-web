"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { InvitationContent } from "@/lib/invitations";
import styles from "./BirthdayRewind.module.css";

const copy = {
  en: { title: "Birthday Rewind", for: "A birthday film for", take: "Take a snapshot", reel: "The memory reel", previous: "Previous photo", next: "Next photo", read: "Read your birthday wish", wish: "Happy birthday", back: "Back to photos", replay: "Rewind to start", demo: "Demo preview", fallback: "For you" },
  si: { title: "උපන්දින මතක", for: "මේ උපන්දින මතක පෙළ", take: "ඡායාරූපයක් ගන්න", reel: "සොඳුරු මතක", previous: "පෙර ඡායාරූපය", next: "ඊළඟ ඡායාරූපය", read: "සුබපැතුම කියවන්න", wish: "සුබ උපන්දිනයක්", back: "ඡායාරූප වෙත", replay: "මුල සිට බලන්න", demo: "පෙරදසුන", fallback: "ඔයාට" },
};
const subscribe = () => () => {};
const client = () => true;
const server = () => false;
const frame = (n: number) => String(n).padStart(2, "0");

export function BirthdayRewind({ content, preview = false }: { content: InvitationContent; preview?: boolean }) {
  const ready = useSyncExternalStore(subscribe, client, server);
  const [lang, setLang] = useState<keyof typeof copy>("en");
  const [stage, setStage] = useState<"camera" | "reel" | "wish">("camera");
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);
  const swipe = useRef<{x: number; y: number} | null>(null);
  const t = copy[lang];
  const name = (lang === "si" && content.birthdayNameSi) || content.partnerOne || t.fallback;
  const message = (lang === "si" && content.birthdayMessageSi) || content.welcome;
  const photos = [...new Set([content.couplePhoto, ...content.gallery].filter(Boolean))];
  const current = Math.min(index, photos.length - 1);

  function go(next: typeof stage, snapshot = false) {
    if (next === "camera") setIndex(0);
    navigated.current = true;
    setFlash(snapshot);
    setStage(next);
  }

  function turn(direction: number) {
    if (photos.length > 1) setIndex((value) => (Math.min(value, photos.length - 1) + direction + photos.length) % photos.length);
  }

  useLayoutEffect(() => {
    if (!navigated.current) return;
    heading.current?.closest("main")?.scrollIntoView({ block: "start", behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, [stage]);

  return (
    <main className={styles.page} lang={lang} data-birthday-theme="B02" data-rewind-stage={stage}>
      <div className={styles.shell}>
        <div className={styles.top}>
          <span className={styles.brand}>NAKATHATA.LK</span>
          <div className={styles.languages} role="group" aria-label={lang === "si" ? "භාෂාව" : "Language"}>
            <button type="button" lang="en" disabled={!ready} aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</button>
            <button type="button" lang="si" disabled={!ready} aria-pressed={lang === "si"} onClick={() => setLang("si")}>සිංහල</button>
          </div>
        </div>
        <section className={styles.booth}>
          {flash && <div className={styles.flash} aria-hidden="true" />}
          {stage === "camera" ? (
            <>
              <div className={styles.label}><span aria-hidden="true">◉</span> {t.for}</div>
              <h1 tabIndex={-1} ref={heading}>{t.title}</h1>
              <p className={styles.name}>{name}</p>
              <button type="button" className={styles.camera} disabled={!ready} onClick={() => go(photos.length ? "reel" : "wish", true)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/invitation-assets/b02/rewind.svg" width={480} height={306} alt="" />
                <span className={styles.shutter}>{t.take} <span aria-hidden="true">↘</span></span>
              </button>
            </>
          ) : stage === "reel" && current >= 0 ? (
            <>
              <div className={styles.label}><span aria-hidden="true">◈</span> {name}</div>
              <h1 tabIndex={-1} ref={heading}>{t.reel}</h1>
              <div className={styles.film} data-developing={flash}
                onTouchStart={(event) => {
                  const touch = event.touches[0];
                  swipe.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
                }}
                onTouchCancel={() => { swipe.current = null; }}
                onTouchEnd={(event) => {
                  const start = swipe.current;
                  swipe.current = null;
                  const end = event.changedTouches[0];
                  if (!start || !end || event.touches.length) return;
                  const dx = end.clientX - start.x;
                  if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(end.clientY - start.y) * 1.5) turn(dx < 0 ? 1 : -1);
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photos[current]} alt={`${t.reel} ${current + 1}`} referrerPolicy="no-referrer" />
              </div>
              <div className={styles.controls}>
                {photos.length > 1 && <button type="button" aria-label={t.previous} onClick={() => turn(-1)}>←</button>}
                <span aria-live="polite">{frame(current + 1)} / {frame(photos.length)}</span>
                {photos.length > 1 && <button type="button" aria-label={t.next} onClick={() => turn(1)}>→</button>}
              </div>
              <button type="button" className={styles.shutter} onClick={() => go("wish")}>{t.read} <span aria-hidden="true">↗</span></button>
            </>
          ) : (
            <>
              <div className={styles.label}><span aria-hidden="true">★</span> {t.title}</div>
              <h1 tabIndex={-1} ref={heading}>{t.wish}</h1>
              <div className={styles.ticket}>
                <p className={styles.recipient}>{name}</p>
                <p className={styles.message}>{message}</p>
                <div className={styles.ticketEnd} aria-hidden="true"><span>✴</span><span /></div>
              </div>
              <div className={styles.actions}>
                {photos.length > 0 && <button type="button" onClick={() => go("reel")}>← {t.back}</button>}
                <button type="button" onClick={() => go("camera")}>↶ {t.replay}</button>
              </div>
            </>
          )}
        </section>
        {preview && <p className={styles.demo}>{t.demo}</p>}
      </div>
    </main>
  );
}
