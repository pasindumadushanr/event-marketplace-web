"use client";

import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "@/lib/api";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  return (
    <form
      className="w-full md:w-auto max-w-md space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage("");
        setFailed(false);
        try {
          await api.post("/contact/newsletter", { email, consent });
          setMessage("Thank you! Your newsletter signup has been saved.");
          setEmail("");
          setConsent(false);
        } catch {
          setFailed(true);
          setMessage("We couldn’t save your signup. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex gap-2">
        <div className="relative w-full">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <Input
            aria-label="Newsletter email address"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter your email"
            className="pl-10 h-12 bg-slate-950 border-slate-800 text-white focus-visible:ring-primary w-full"
          />
        </div>
        <Button
          type="submit"
          disabled={busy || !consent}
          className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
        >
          {busy ? "Saving…" : "Subscribe"}
        </Button>
      </div>
      <label className="flex items-start gap-2 text-xs text-slate-300">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        I agree to receive event tips and offers by email.
      </label>
      {message && (
        <p role={failed ? "alert" : "status"} className="text-sm text-white">
          {message}
        </p>
      )}
    </form>
  );
}
