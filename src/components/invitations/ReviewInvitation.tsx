"use client";
import { useEffect, useState } from "react";
import { InvitationContent } from "@/lib/invitations";
import { InvitationExperience } from "./InvitationExperience";
export function ReviewInvitation({ id }: { id: string }) {
  const [content, setContent] = useState<InvitationContent | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = location.hash.slice(1);
    const abort = new AbortController();
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/public/invitations/review`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token }),
        cache: "no-store",
        signal: abort.signal,
      },
    )
      .then(async (r) => {
        if (!r.ok)
          throw new Error(
            "This review link has expired or is no longer available. Ask the invitation team for a new link.",
          );
        return r.json();
      })
      .then((v) => setContent(v.content))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => abort.abort();
  }, [id]);
  return content ? (
    <InvitationExperience content={content} preview />
  ) : (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 p-6 text-center">
      <p role={error ? "alert" : "status"}>
        {error || "Opening your private preview…"}
      </p>
    </main>
  );
}
