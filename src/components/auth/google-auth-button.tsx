"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { useEffect, useState, useSyncExternalStore } from "react";

export function GoogleAuthButton({
  mode,
  intent = "customer",
  disabled = false,
}: {
  mode: "login" | "register";
  intent?: "customer" | "vendor";
  disabled?: boolean;
}) {
  const { t } = useLanguage();
  const [vendorReady, setVendorReady] = useState<boolean | null>(null);
  useEffect(() => {
    if (intent !== "vendor") return;
    let active = true;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/google/vendor-status`,
      { cache: "no-store", signal: AbortSignal.timeout(10000) },
    )
      .then(
        async (response) =>
          response.ok && (await response.json()).enabled === true,
      )
      .then((enabled) => {
        if (active) setVendorReady(enabled);
      })
      .catch(() => {
        if (active) setVendorReady(false);
      });
    return () => {
      active = false;
    };
  }, [intent]);
  const googleFailed = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).has("googleError"),
    () => false,
  );
  const handleGoogleAuth = () => {
    if (intent === "vendor" && vendorReady !== true) return;
    // Redirect to the backend Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/google${intent === "vendor" ? "?intent=vendor" : ""}`;
  };

  return (
    <div className="space-y-2">
      {googleFailed && (
        <p
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950"
        >
          Google sign-in did not complete. Try again or use email and password.
          If you have a customer account, use the customer sign-in page.
        </p>
      )}
      <Button
        variant="outline"
        type="button"
        disabled={disabled || (intent === "vendor" && vendorReady !== true)}
        className="w-full h-11 text-base font-medium shadow-sm transition-all hover:shadow-md hover:bg-zinc-50"
        onClick={handleGoogleAuth}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        {intent === "vendor" || mode === "login"
          ? "Continue with Google"
          : t("Sign up with Google")}
      </Button>
      {intent === "vendor" && vendorReady === false && (
        <p
          role="status"
          className="text-center text-xs leading-5 text-slate-500"
        >
          Google sign-in is temporarily unavailable. Please use email and
          password.
        </p>
      )}
    </div>
  );
}
