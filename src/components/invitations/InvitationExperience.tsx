"use client";

import { useCallback, useEffect, useRef } from "react";
import { InvitationContent } from "@/lib/invitations";

// Use the supplied standalone document so its global CSS, viewport and original
// animation code are not altered by the marketplace's Tailwind/theme styles.
export function InvitationExperience({
  content,
  preview = false,
  demo = false,
}: {
  content: InvitationContent;
  preview?: boolean;
  demo?: boolean;
}) {
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
    return () => window.removeEventListener("message", ready);
  }, [send]);
  return (
    <iframe
      key={JSON.stringify([content, preview, demo])}
      ref={frame}
      title="Wedding invitation — W01"
      src="/invitation-assets/w01/index.html"
      onLoad={send}
      sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
      allow="clipboard-write; web-share"
      className="block w-full border-0"
      style={{ height: "100svh", background: "#36382c" }}
    />
  );
}
