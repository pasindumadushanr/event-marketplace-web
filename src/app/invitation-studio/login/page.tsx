"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { studioRequest, studioRoles } from "@/lib/invitations";
export default function StudioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const value = await studioRequest(
        userId ? "/auth/verify-admin-login" : "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(userId ? { userId, otp } : { email, password }),
        },
      );
      if (value.requiresOtp) {
        setUserId(value.userId);
        setPassword("");
        return;
      }
      if (!studioRoles.includes(value.user?.roleName))
        throw new Error("This account does not have Invitation Studio access.");
      sessionStorage.setItem("invitationStudioToken", value.accessToken);
      try {
        await studioRequest("/invitation-studio/session");
      } catch (failure) {
        sessionStorage.removeItem("invitationStudioToken");
        throw failure;
      }
      router.replace("/invitation-studio");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#303c31] flex items-center justify-center p-5">
      <section className="w-full max-w-md rounded-3xl bg-[#fbf8ef] p-7 sm:p-10 shadow-xl">
        <p className="text-xs uppercase tracking-widest text-amber-800">
          Nakathata.lk · For your creative team
        </p>
        <h1 className="mt-4 text-4xl font-serif text-[#354332]">
          Invitation Studio
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          A little workspace for beautiful beginnings.
        </p>
        <form className="mt-7 space-y-5" onSubmit={submit}>
          {userId ? (
            <label className="block text-sm">
              Email verification code
              <input
                className="mt-2 w-full rounded-xl border p-3"
                aria-label="Email verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                pattern="[0-9]{6}"
                autoComplete="one-time-code"
                required
              />
              <span className="mt-2 block text-xs text-stone-500">
                Enter the six-digit code sent to your staff email.
              </span>
            </label>
          ) : (
            <>
              <label className="block text-sm">
                Staff email
                <input
                  className="mt-2 w-full rounded-xl border p-3"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                Password
                <input
                  className="mt-2 w-full rounded-xl border p-3"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-800">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="min-h-12 w-full rounded-xl bg-[#344b39] px-5 font-semibold text-white disabled:opacity-50"
          >
            {busy
              ? "Checking…"
              : userId
                ? "Verify & open studio"
                : "Sign in to studio"}
          </button>
        </form>
        <p className="mt-6 text-xs text-stone-500">
          Invitation staff and approved website administrators only. Customer
          accounts cannot sign in here.
        </p>
      </section>
    </main>
  );
}
