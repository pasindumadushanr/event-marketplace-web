"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { InvitationContent } from "@/lib/invitations";
import styles from "./BirthdayExperience.module.css";

const copy = {
  en: { surprise: "A little birthday surprise", open: "Open your surprise", wish: "Make a wish", blow: "Blow out the candles", happy: "Happy birthday", memories: "Favourite memories", previous: "Previous photo", next: "Next photo", replay: "Play again", preview: "Demo preview", coverHint: "A little something, just for you.", cakeHint: "Close your eyes and think of something wonderful.", letter: "A note for you", album: "The memory album", chapters: "Birthday card progress" },
  si: { surprise: "පුංචි උපන්දින පුදුමයක්", open: "පුදුමය විවෘත කරන්න", wish: "ප්‍රාර්ථනාවක් කරන්න", blow: "ඉටිපන්දම් නිවන්න", happy: "සුබ උපන්දිනයක්", memories: "සොඳුරු මතක", previous: "පෙර ඡායාරූපය", next: "ඊළඟ ඡායාරූපය", replay: "නැවත බලන්න", preview: "පෙරදසුන", coverHint: "ඔයා වෙනුවෙන්ම පුංචි තෑග්ගක්.", cakeHint: "ඇස් පියාගෙන හිතේ තියෙන ලස්සන ප්‍රාර්ථනාවක් කරන්න.", letter: "ඔයාට ලියපු පුංචි සටහනක්", album: "මතක පොත", chapters: "උපන්දින කාඩ්පතේ පියවර" },
};
const confetti = ["#ad3153", "#d68b83", "#d5a159", "#788d61", "#ffc6aa"];
const chapters = ["cover", "cake", "wish"] as const;
const subscribeToClient = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const UNWRAP_DURATION = 2100;

function BirthdayArt({ lit }: { lit: boolean }) {
  return (
    <div className={styles.art} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/invitation-assets/b01/rose-cake.webp"
        alt=""
        width={960}
        height={1200}
        fetchPriority="high"
      />
      {lit ? <span className={styles.flame} /> : <span className={styles.smoke} />}
    </div>
  );
}

function RibbonEnvelope({
  name, label, hint, ready, opening, onOpen,
}: {
  name: string;
  label: string;
  hint: string;
  ready: boolean;
  opening: boolean;
  onOpen: () => void;
}) {
  const satin = useId();
  return (
    <div className={`${styles.art} ${styles.giftStage}`} data-unwrapping={opening}>
      <span className={styles.giftSparkOne} aria-hidden="true">✧</span>
      <span className={styles.giftSparkTwo} aria-hidden="true">✦</span>
      <div className={styles.envelope}>
        <div className={styles.envelopeBack} aria-hidden="true" />
        <div className={styles.envelopeLetter} aria-hidden="true">
          <span>✿</span><span>{name}</span><span>♥</span>
        </div>
        <div className={styles.envelopePocket} aria-hidden="true" />
        <div className={styles.envelopeFlap} aria-hidden="true" />
        <div className={styles.verticalRibbon} aria-hidden="true" />
        <div className={styles.horizontalRibbon} aria-hidden="true" />
        <button type="button" className={styles.bowButton} aria-label={label} disabled={!ready || opening} onClick={onOpen}>
          <svg className={styles.bow} viewBox="0 0 220 145" aria-hidden="true">
            <defs>
              <linearGradient id={satin} x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#5f1229" />
                <stop offset=".35" stopColor="#b75d72" />
                <stop offset=".52" stopColor="#8d2b49" />
                <stop offset="1" stopColor="#580f29" />
              </linearGradient>
            </defs>
            <g fill={`url(#${satin})`} stroke="#671a35" strokeWidth="1.2" strokeLinejoin="round">
              <path d="M98 48C80 82 66 98 41 129l26-5 9 17c20-27 35-47 42-80Z" />
              <path d="M120 48c15 30 34 50 60 78l-27-4-8 18c-23-26-40-47-48-79Z" />
              <path d="M108 49C77 18 39-3 17 10 1 20 4 50 20 62c21 15 57 7 88-6Z" />
              <path d="M112 49C143 18 181-3 203 10c16 10 13 40-3 52-21 15-57 7-88-6Z" />
              <path d="M102 40c5-3 14-3 19 1l1 18c-5 6-17 7-24 1Z" />
            </g>
            <g fill="none" stroke="#f7b6be" strokeOpacity=".36" strokeLinecap="round">
              <path d="M94 47C66 38 39 26 21 31m105 16c28-9 55-21 73-16M94 56c-27 2-53 4-72-6m104 6c27 2 53 4 72-6" />
            </g>
          </svg>
        </button>
      </div>
      <p className={styles.ribbonHint} aria-hidden="true">{hint}</p>
    </div>
  );
}

export function BirthdayExperience({ content, preview = false }: { content: InvitationContent; preview?: boolean }) {
  const ready = useSyncExternalStore(subscribeToClient, clientReady, serverReady);
  const [language, setLanguage] = useState<keyof typeof copy>("en");
  const [stage, setStage] = useState<"cover" | "cake" | "wish">("cover");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [opening, setOpening] = useState(false);
  const [extinguished, setExtinguished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const t = copy[language];
  const chapter = chapters.indexOf(stage);
  const name = (language === "si" ? content.birthdayNameSi : "") || content.partnerOne;
  const message = (language === "si" ? content.birthdayMessageSi : "") || content.welcome;
  const photos = [...new Set([content.couplePhoto, ...content.gallery].filter(Boolean))];

  function changePhoto(direction: number) {
    if (photos.length > 1)
      setPhotoIndex((index) => (index + direction + photos.length) % photos.length);
  }

  function advance(next: typeof stage) {
    if (next === "cover") {
      setPhotoIndex(0);
      setOpening(false);
      setExtinguished(false);
    }
    moved.current = true;
    setStage(next);
  }
  useLayoutEffect(() => {
    if (!moved.current) return;
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stage]);
  useEffect(() => {
    if (!opening || stage !== "cover") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      moved.current = true;
      setStage("cake");
      setOpening(false);
    }, reduced ? 0 : UNWRAP_DURATION);
    return () => window.clearTimeout(timer);
  }, [opening, stage]);
  useEffect(() => {
    if (!extinguished || stage !== "cake") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      moved.current = true;
      setStage("wish");
    }, reduced ? 0 : 760);
    return () => window.clearTimeout(timer);
  }, [extinguished, stage]);

  return (
    <main className={styles.page} lang={language} data-birthday-theme="B01">
      <div className={styles.toolbar}>
        <span className={styles.brand}><span aria-hidden="true">✧</span> NAKATHATA.LK</span>
        <div className={styles.languages} role="group" aria-label={language === "si" ? "භාෂාව" : "Language"}>
          <button type="button" lang="en" disabled={!ready} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</button>
          <button type="button" lang="si" disabled={!ready} aria-pressed={language === "si"} onClick={() => setLanguage("si")}>සිංහල</button>
        </div>
      </div>
      <section className={styles.card} data-chapter={stage}>
        {stage === "wish" && (
          <div className={styles.confetti} aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 37) % 100}%`, background: confetti[i % confetti.length], animationDelay: `${(i % 8) * 90}ms`, animationDuration: `${1600 + (i % 6) * 200}ms` }} />
            ))}
          </div>
        )}
        <div className={styles.heading} key={`heading-${stage}`}>
          <div className={styles.ornament} aria-hidden="true">✿</div>
          <p className={styles.eyebrow}><span aria-hidden="true">✦</span>{stage === "cover" ? t.surprise : stage === "cake" ? t.wish : t.happy}</p>
          <h1 ref={heading} tabIndex={-1}>{name || (language === "si" ? "ඔබ වෙනුවෙන්" : "For you")}</h1>
          {stage !== "wish" && <p className={styles.hint}>{stage === "cover" ? t.coverHint : t.cakeHint}</p>}
        </div>
        {stage === "cover" && (
          <RibbonEnvelope
            name={name}
            label={language === "si" ? "රිබන් පටිය ලිහන්න" : "Untie the ribbon"}
            hint={language === "si" ? "රිබන් පටිය ස්පර්ශ කරන්න" : "Tap the ribbon to open"}
            ready={ready}
            opening={opening}
            onOpen={() => setOpening(true)}
          />
        )}
        {stage === "cake" && <BirthdayArt lit={!extinguished} />}
        {stage === "wish" ? (
          <div className={styles.note}>
            <div className={styles.noteLabel}>{t.letter}</div>
            <p className={styles.message}>{message}</p>
            <span aria-hidden="true">♥</span>
          </div>
        ) : (
          <button type="button" className={styles.action} disabled={!ready || opening || extinguished} onClick={() => {
            if (stage === "cover") setOpening(true);
            else setExtinguished(true);
          }}>
            {stage === "cover" ? t.open : t.blow} <span aria-hidden="true">{stage === "cover" ? "→" : "✦"}</span>
          </button>
        )}
      </section>
      <div className={styles.chapters} aria-label={t.chapters} role="group">
        {chapters.map((step, index) => <span key={step} data-current={chapter === index} aria-current={chapter === index ? "step" : undefined}>{String(index + 1).padStart(2, "0")}</span>)}
      </div>
      {stage === "wish" && (
        <>
          {photos.length > 0 && (
            <section className={styles.memories} aria-label={t.memories}>
              <p className={styles.eyebrow}>{t.album}</p>
              <h2>{t.memories}</h2>
              <div
                className={styles.photoFrame}
                onTouchStart={(event) => {
                  const touch = event.touches[0];
                  swipeStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
                }}
                onTouchCancel={() => { swipeStart.current = null; }}
                onTouchEnd={(event) => {
                  const start = swipeStart.current;
                  swipeStart.current = null;
                  const touch = event.changedTouches[0];
                  if (!start || !touch || event.touches.length) return;
                  const dx = touch.clientX - start.x;
                  const dy = touch.clientY - start.y;
                  if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.45)
                    changePhoto(dx < 0 ? 1 : -1);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={photos[photoIndex]} className={styles.photo} src={photos[photoIndex]} alt={`${t.memories} ${photoIndex + 1}`} loading="lazy" referrerPolicy="no-referrer" />
                <span aria-hidden="true">✦</span>
              </div>
              {photos.length > 1 && <div className={styles.photoControls}>
                <button type="button" aria-label={t.previous} onClick={() => changePhoto(-1)}>←</button>
                <span aria-live="polite">{photoIndex + 1} / {photos.length}</span>
                <button type="button" aria-label={t.next} onClick={() => changePhoto(1)}>→</button>
              </div>}
            </section>
          )}
          <button className={styles.replay} type="button" onClick={() => advance("cover")}>{t.replay} ↻</button>
        </>
      )}
      {preview && <p className={styles.preview}>{t.preview}</p>}
    </main>
  );
}
