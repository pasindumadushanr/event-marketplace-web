"use client";

import { useState } from "react";
import { useLanguage, LanguageSwitch } from "@/lib/language";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function VendorRegisterPage() {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Force VENDOR role
      const payload = { ...data, role: "VENDOR" };
      const response = await api.post("/auth/register", payload);

      // Auto login to set JWT, which will route them to /vendor
      login(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user,
      );

      toast.success(t("Account created! Please verify your email."));
      // The layout or auth context will route them, but since we want them to go to verify-email:
      window.location.href = "/vendor/verify-email";
    } catch (error: any) {
      toast.error(
        language === "en"
          ? error.response?.data?.message || t("Failed to create account")
          : t("Failed to create account"),
      );
      setIsLoading(false);
    }
  };

  return (
    <div lang={language} className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Event Setup"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <Link href="/" className="flex items-center gap-2 mb-8 inline-block">
            <BrandLogo className="w-48" />
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            {t("Join the most exclusive event marketplace.")}
          </h2>
          <p className="text-lg text-slate-300 font-light max-w-md">
            {t(
              "Connect with premium clients, manage bookings seamlessly, and elevate your event business to the next level.",
            )}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="absolute top-8 right-8">
          <p className="text-sm text-slate-500">
            {t("Already have an account?")}{" "}
            <Link
              href="/vendor/login"
              className="text-primary hover:underline font-semibold"
            >
              {t("Sign in")}
            </Link>
          </p>
        </div>

        <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <BrandLogo className="w-48" />
          </div>

          <LanguageSwitch disabled={isLoading} />
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {t("Create Vendor Account")}
            </h1>
            <p className="text-slate-500">
              {t(
                "Enter your details to start accepting premium bookings today.",
              )}
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 mt-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-slate-700 font-semibold"
                >
                  {t("First name")}
                </Label>
                <Input
                  id="firstName"
                  className="h-12 bg-white border-slate-200 focus-visible:ring-primary"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {t(errors.firstName.message || "")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-slate-700 font-semibold"
                >
                  {t("Last name")}
                </Label>
                <Input
                  id="lastName"
                  className="h-12 bg-white border-slate-200 focus-visible:ring-primary"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {t(errors.lastName.message || "")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">
                {t("Business Email")}
              </Label>
              <Input
                id="email"
                type="email"
                className="h-12 bg-white border-slate-200 focus-visible:ring-primary"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {t(errors.email.message || "")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-semibold">
                {t("Phone Number")}
              </Label>
              <Input
                id="phone"
                type="tel"
                className="h-12 bg-white border-slate-200 focus-visible:ring-primary"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">
                  {t(errors.phone.message || "")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-slate-700 font-semibold"
              >
                {t("Password")}
              </Label>
              <Input
                id="password"
                type="password"
                className="h-12 bg-white border-slate-200 focus-visible:ring-primary"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {t(errors.password.message || "")}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all"
              disabled={isLoading}
            >
              {t(isLoading ? "Creating account..." : "Continue to Onboarding")}
            </Button>

            <p className="text-center text-sm text-slate-500 mt-6">
              {t("By creating an account, you agree to our")}{" "}
              <a href="/terms" className="text-primary hover:underline">
                {t("Terms of Service")}
              </a>{" "}
              {t("and")}{" "}
              <a href="/privacy" className="text-primary hover:underline">
                {t("Privacy Policy")}
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
