"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";
import { isPlatformSettings } from "@/lib/platform-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Field = {
  key: string;
  label: string;
  help?: string;
  type?: string;
  multiline?: boolean;
  readOnly?: boolean;
};
type EmailStatus = {
  provider: string;
  configured: boolean;
  fromEmail: string;
  credentialsManagedIn: string;
};
function errorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message: unknown = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message))
      return message.filter((item) => typeof item === "string").join(". ");
  }
  return fallback;
}
export function SettingsEditor({
  settingKey,
  title,
  description,
  defaults,
  fields,
  children,
}: {
  settingKey: string;
  title: string;
  description: string;
  defaults: Record<string, string>;
  fields: Field[];
  children?: React.ReactNode;
}) {
  const [values, setValues] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testing, setTesting] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [setting, platform, status] = await Promise.all([
          api.get(`/admin/cms/settings/${settingKey}`),
          api.get("/admin/cms/public/platform-settings"),
          settingKey === "email"
            ? api.get<EmailStatus>("/admin/cms/email/status")
            : Promise.resolve(null),
        ]);
        if (!isPlatformSettings(platform.data))
          throw new Error("backend version");
        const data: unknown = setting.data;
        if (data !== null && (typeof data !== "object" || Array.isArray(data)))
          throw new Error("Invalid settings response");
        const next = { ...defaults };
        for (const key of Object.keys(defaults)) {
          const value = (data as Record<string, unknown> | null)?.[key];
          if (typeof value === "string") next[key] = value;
        }
        if (active) {
          setValues(next);
          setEmailStatus(status?.data || null);
        }
      } catch {
        if (active)
          setError(
            "Settings could not be loaded. Retry, or deploy the latest backend in Render. Saving is disabled to protect existing values.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
    // Defaults are fixed configuration supplied by each page, not mutable inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingKey, retry]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || error) return;
    setSaving(true);
    try {
      await api.post(`/admin/cms/settings/${settingKey}`, { value: values });
      toast.success(
        "Settings saved. Public changes appear on new page loads; search metadata can take about a minute.",
      );
    } catch (failure) {
      toast.error(
        errorMessage(failure, "Settings could not be saved. Please try again."),
      );
    } finally {
      setSaving(false);
    }
  };
  const testEmail = async () => {
    if (!emailStatus?.configured) return;
    setTesting(true);
    try {
      const response = await api.post<{ recipient: string }>(
        "/admin/cms/email/test",
      );
      toast.success(
        `Provider accepted a test email to ${response.data.recipient}. Check your inbox and spam folder.`,
      );
    } catch (failure) {
      toast.error(errorMessage(failure, "Test email could not be sent."));
    } finally {
      setTesting(false);
    }
  };
  return (
    <section className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
      {loading ? (
        <p role="status">Loading settings…</p>
      ) : error ? (
        <div role="alert" className="rounded-xl border bg-white p-5">
          <p>{error}</p>
          <Button
            className="mt-4"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try again
          </Button>
        </div>
      ) : (
        <>
          {emailStatus && (
            <div className="rounded-xl border bg-slate-50 p-5 space-y-2 text-sm">
              <p>
                <strong>Active provider:</strong> {emailStatus.provider}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {emailStatus.configured
                  ? "Configured — test delivery below"
                  : "Not configured for real email delivery"}
              </p>
              <p>
                <strong>Sender email:</strong>{" "}
                {emailStatus.fromEmail || "Not configured"}
              </p>
              <p>
                Passwords and API secrets are managed in Render, not this
                dashboard. Set SMTP_PROVIDER to smtp or resend, and configure
                SMTP_FROM_EMAIL. For SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER,
                SMTP_PASS. For Resend: RESEND_API_KEY. Redeploy after changing
                these.
              </p>
              <Button
                variant="outline"
                disabled={!emailStatus.configured || testing}
                onClick={testEmail}
              >
                {testing ? "Sending…" : "Send test to my account email"}
              </Button>
              <p>
                Save the sender name first if you want to test a new name.
                Provider acceptance does not guarantee inbox delivery.
              </p>
            </div>
          )}
          <form
            onSubmit={save}
            className="space-y-5 rounded-xl border bg-white p-5 sm:p-7"
          >
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`setting-${field.key}`}>{field.label}</Label>
                {field.multiline ? (
                  <Textarea
                    id={`setting-${field.key}`}
                    value={values[field.key]}
                    rows={3}
                    onChange={(e) =>
                      setValues({ ...values, [field.key]: e.target.value })
                    }
                  />
                ) : (
                  <Input
                    id={`setting-${field.key}`}
                    type={field.type || "text"}
                    readOnly={field.readOnly}
                    value={values[field.key]}
                    onChange={(e) =>
                      setValues({ ...values, [field.key]: e.target.value })
                    }
                  />
                )}
                {field.help && (
                  <p className="text-xs text-slate-500">{field.help}</p>
                )}
              </div>
            ))}
            {children}
            {settingKey === "FOOTER_CONTENT" && (
              <p className="text-sm">
                <Link href="/admin/settings/social" className="underline">
                  Edit social links
                </Link>{" "}
                — shared with the footer and Contact page.
              </p>
            )}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
