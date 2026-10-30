"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { InvitationContent } from "@/lib/invitations";
import { whatsappUrl } from "@/lib/whatsapp";
import "./invitation.css";

export function InvitationExperience({
  content: c,
  preview = false,
}: {
  content: InvitationContent;
  preview?: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [music, setMusic] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const notes = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(
    () => () => {
      if (notes.current) clearInterval(notes.current);
      void audio.current?.close();
    },
    [],
  );
  useEffect(
    () => () => {
      if (openingTimer.current) clearTimeout(openingTimer.current);
    },
    [],
  );
  function openEnvelope() {
    if (opening) return;
    setOpening(true);
    openingTimer.current = setTimeout(() => {
      setOpened(true);
      setOpening(false);
    }, 650);
  }
  async function toggleMusic() {
    if (music) {
      if (notes.current) clearInterval(notes.current);
      await audio.current?.suspend();
      setMusic(false);
      return;
    }
    try {
      audio.current ||= new AudioContext();
      await audio.current.resume();
      let step = 0;
      const play = () => {
        const ctx = audio.current!;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = [261.63, 329.63, 392, 523.25, 392, 329.63][
          step++ % 6
        ];
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.7);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 1.8);
      };
      play();
      notes.current = setInterval(play, 1100);
      setMusic(true);
    } catch {
      setMessage("Sound is not available in this browser.");
    }
  }
  const date = c.weddingAt ? new Date(c.weddingAt) : null;
  const validDate = date && Number.isFinite(date.getTime());
  const day = validDate
    ? date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Colombo",
      })
    : "Wedding date";
  const time = validDate
    ? date.toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Colombo",
      })
    : "";
  const left = validDate && now ? Math.max(0, date.getTime() - now) : null;
  const rsvp = whatsappUrl(
    c.rsvpPhone,
    `Hello! I'd like to RSVP for ${c.partnerOne} & ${c.partnerTwo}'s wedding on ${day}. My name is: `,
  );
  async function download() {
    try {
      await document.fonts.ready;
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d")!;
      const flowers = new Image();
      flowers.src = "/images/invitations/w01-lilies.jpg";
      await flowers.decode();
      ctx.drawImage(flowers, 0, 0, 1080, 1350);
      ctx.fillStyle = "#20261ab8";
      ctx.fillRect(0, 0, 1080, 1350);
      ctx.strokeStyle = "#ddd3b2";
      ctx.lineWidth = 2;
      ctx.strokeRect(45, 45, 990, 1260);
      ctx.textAlign = "center";
      ctx.fillStyle = "#f7f1e0";
      const line = (text: string, y: number, size: number, serif = false) => {
        ctx.font = `${serif ? "italic " : ""}${size}px ${serif ? "Georgia" : "Arial"}`;
        while (ctx.measureText(text).width > 920 && size > 18)
          ctx.font = `${serif ? "italic " : ""}${--size}px ${serif ? "Georgia" : "Arial"}`;
        ctx.fillText(text, 540, y, 920);
      };
      line("TOGETHER WITH OUR FAMILIES", 290, 24);
      line(c.partnerOne, 480, 105, true);
      line("&", 600, 70, true);
      line(c.partnerTwo, 730, 105, true);
      line("invite you to celebrate their wedding", 840, 30, true);
      line(`${day} · ${time}`, 950, 27);
      line(c.venue, 1015, 28);
      line(c.address, 1060, 22);
      line("A beautiful beginning. Better with you.", 1190, 29, true);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wedding-invitation.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setMessage(
        "Card downloaded. Send it on WhatsApp with the invitation link in your message.",
      );
    } catch {
      setMessage("Could not download the card. Please try again.");
    }
  }
  return (
    <div className="invitation-w01">
      {preview && (
        <p className="invite-preview">
          Preview only · not the published invitation
        </p>
      )}
      {!opened ? (
        <section
          className={`invite-envelope ${opening ? "invite-unsealing" : ""}`}
          aria-label="Wedding invitation envelope"
        >
          <p className="invite-eyebrow">A new chapter, written in love</p>
          <p className="invite-greeting">
            Especially for
            <br />
            you & your loved ones
          </p>
          <button
            className="invite-seal"
            disabled={opening}
            onClick={openEnvelope}
            aria-label="Open wedding invitation"
          >
            ♡
          </button>
          <p className="invite-tap">Touch the seal to open</p>
          <h1>
            {c.partnerOne || "Your name"} & {c.partnerTwo || "Your partner"}
          </h1>
          <p>{day}</p>
          <button className="invite-skip" onClick={() => setOpened(true)}>
            Skip intro ↗
          </button>
        </section>
      ) : (
        <div className="invite-opened">
          <header className="invite-top">
            <a href="#our-day">
              {c.partnerOne.charAt(0)} & {c.partnerTwo.charAt(0)}
            </a>
            <a href="#rsvp">RSVP ↗</a>
          </header>
          <section className="invite-hero" id="our-day">
            <div>
              <p className="invite-eyebrow">Together with our families</p>
              <h1>
                {c.partnerOne}
                <em>&</em>
                {c.partnerTwo}
              </h1>
              <p className="invite-welcome">{c.welcome}</p>
              <p className="invite-date">
                {day} · {time}
              </p>
            </div>
            {c.couplePhoto && (
              <img
                src={c.couplePhoto}
                alt={`${c.partnerOne} and ${c.partnerTwo}`}
                className="invite-portrait"
              />
            )}
          </section>
          {left !== null && (
            <section
              className="invite-countdown"
              aria-label="Wedding countdown"
            >
              {left === 0 ? (
                <p>Our forever has begun.</p>
              ) : (
                <>
                  {[
                    [Math.floor(left / 86400000), "Days"],
                    [Math.floor(left / 3600000) % 24, "Hours"],
                    [Math.floor(left / 60000) % 60, "Minutes"],
                    [Math.floor(left / 1000) % 60, "Seconds"],
                  ].map(([n, label]) => (
                    <div key={label}>
                      <strong>{n}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </>
              )}
            </section>
          )}
          <section className="invite-details">
            <p className="invite-eyebrow">A day to remember</p>
            <h2>Join our celebration</h2>
            <p>
              {day} · {time}
            </p>
            <h3>{c.venue}</h3>
            <p>{c.address}</p>
            {c.mapUrl && (
              <a
                className="invite-button"
                href={c.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions ↗
              </a>
            )}
          </section>
          {c.story && (
            <section className="invite-story">
              <p className="invite-eyebrow">Our story</p>
              <h2>
                A little serendipity.
                <br />
                <em>A lifetime of love.</em>
              </h2>
              <p>{c.story}</p>
            </section>
          )}
          {!!c.gallery.length && (
            <section className="invite-gallery" aria-label="Our photos">
              {c.gallery.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`Wedding gallery ${i + 1}`}
                  loading="lazy"
                />
              ))}
            </section>
          )}
          <section id="rsvp" className="invite-details">
            <p className="invite-eyebrow">We saved you a place</p>
            <h2>Will you join us?</h2>
            <p>Let us know through WhatsApp.</p>
            {rsvp ? (
              <a
                href={rsvp}
                className="invite-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                RSVP on WhatsApp ↗
              </a>
            ) : (
              <p>
                {preview
                  ? "RSVP is disabled in this demo. Add the couple’s WhatsApp number in the studio."
                  : "Please contact the couple directly to RSVP."}
              </p>
            )}
          </section>
          <footer className="invite-closing">
            <h2>See you at our beginning.</h2>
            <p>
              {c.partnerOne} & {c.partnerTwo}
            </p>
            <div>
              <button onClick={download}>Download invitation card ↓</button>
              <button onClick={() => setOpened(false)}>
                Open envelope again ↻
              </button>
              {!preview && (
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(location.href);
                      setMessage("Invitation link copied.");
                    } catch {
                      setMessage(
                        "Copy the invitation link from your address bar.",
                      );
                    }
                  }}
                >
                  Copy invitation link
                </button>
              )}
            </div>
            <p role="status">{message}</p>
            <small>Created with Nakathata.lk</small>
          </footer>
        </div>
      )}
      {c.music && (
        <button
          aria-pressed={music}
          className="invite-sound"
          onClick={toggleMusic}
        >
          {music ? "Sound on ♫" : "Sound off ♫"}
        </button>
      )}
    </div>
  );
}
