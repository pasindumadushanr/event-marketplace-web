"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { LanguageSwitch, useLanguage } from "@/lib/language";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Send OTP automatically when page loads
  useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = async () => {
    setIsSending(true);
    try {
      await api.post("/auth/send-verification-otp");
      toast.success(t("Verification code sent to your email."));
    } catch (error: any) {
      if (error.response?.data?.message === "Email already verified") {
        router.push("/vendor/onboarding");
      } else {
        toast.error(
          language === "en"
            ? error.response?.data?.message ||
                t("Failed to send verification code.")
            : t("Failed to send verification code."),
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error(t("Please enter a valid 6-digit code."));
      return;
    }

    setIsVerifying(true);
    try {
      await api.post("/auth/verify-email-otp", { otp });
      toast.success(t("Email verified successfully!"));
      router.push("/vendor/onboarding");
    } catch (error: any) {
      toast.error(
        language === "en"
          ? error.response?.data?.message || t("Failed to verify email.")
          : t("Failed to verify email."),
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      lang={language}
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-4 sm:p-8 text-center space-y-6">
        <LanguageSwitch disabled={isVerifying || isSending} />
        <div className="mx-auto w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mb-2">
          <Mail className="h-10 w-10 text-blue-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("Verify your email")}
          </h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            {t(
              "We've sent a 6-digit verification code to your email address. Please enter it below to continue.",
            )}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t("Enter 6-digit code")}
              aria-label={t("Enter 6-digit code")}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
              }
              className="pl-12 h-14 text-center text-xl tracking-widest font-mono bg-slate-50"
            />
          </div>

          <Button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold shadow-md"
          >
            {isVerifying ? t("Verifying...") : t("Verify Email")}
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            {t("Didn't receive the code?")}{" "}
            <button
              onClick={sendOtp}
              disabled={isSending}
              className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
            >
              {isSending ? t("Sending...") : t("Resend Code")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
