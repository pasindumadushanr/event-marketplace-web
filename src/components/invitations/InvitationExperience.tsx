"use client";

import { useCallback, useEffect, useRef } from "react";
import { InvitationContent } from "@/lib/invitations";
import { BirthdayExperience } from "./BirthdayExperience";
import { BirthdayRewind } from "./BirthdayRewind";
import { ClassicWeddingInvitation } from "./ClassicWeddingInvitation";
import { isClassicWedding } from "@/lib/invitation-templates";

// Use the supplied standalone document so its global CSS, viewport and original
// animation code are not altered by the marketplace's Tailwind/theme styles.
export function InvitationExperience(props: {
  content: InvitationContent;
  preview?: boolean;
  demo?: boolean;
  templateId?: string;
}) {
  if (props.templateId === "B02")
    return <BirthdayRewind content={props.content} preview={props.preview || props.demo} />;
  if (props.templateId === "B01")
    return <BirthdayExperience content={props.content} preview={props.preview || props.demo} />;
  if (isClassicWedding(props.templateId))
    return <ClassicWeddingInvitation content={props.content} templateId={props.templateId} demo={props.demo} preview={props.preview} />;
  return <WeddingInvitationFrame {...props} />;
}

function WeddingInvitationFrame({
  content,
  preview = false,
  demo = false,
  templateId = "W01",
}: {
  content: InvitationContent;
  preview?: boolean;
  demo?: boolean;
  templateId?: string;
}) {
  const sinhala = templateId === "W02";
  const frame = useRef<HTMLIFrameElement>(null);
  const send = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      {
        type: "nakathata:invitation-content",
        content,
        preview,
        demo,
        url: location.href,
        guest:
          new URLSearchParams(location.search).get("to")?.slice(0, 100) || "",
      },
      location.origin,
    );
  }, [content, preview, demo]);
  useEffect(() => {
    const ready = (event: MessageEvent) => {
      if (
        event.origin === location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "nakathata:invitation-ready"
      )
        send();
    };
    window.addEventListener("message", ready);
    // A cached iframe may finish before React hydrates and attaches onLoad.
    // Send once now as well; the document ignores duplicate configuration.
    send();
    return () => window.removeEventListener("message", ready);
  }, [send]);
  return (
    <iframe
      key={JSON.stringify([content, preview, demo, templateId])}
      ref={frame}
      title={`Wedding invitation — ${templateId}`}
      src={
        sinhala
          ? "/invitation-assets/w02/index.html"
          : "/invitation-assets/w01/index.html"
      }
      onLoad={send}
      sandbox={`allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox${sinhala ? " allow-modals" : ""}`}
      referrerPolicy="no-referrer"
      allow="clipboard-write; web-share"
      className="block w-full border-0"
      style={{ height: "100svh", background: "#36382c" }}
    />
  );
}
