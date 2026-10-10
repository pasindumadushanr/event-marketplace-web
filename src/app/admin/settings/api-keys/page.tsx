import { SettingsEditor } from "@/components/admin/SettingsEditor";
export default function ApiKeysSettingsPage() {
  return (
    <SettingsEditor
      settingKey="apikeys"
      title="Integrations"
      description="Only active integrations can be configured here. Measurement IDs are public identifiers, not passwords."
      defaults={{ googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "" }}
      fields={[
        {
          key: "googleAnalyticsId",
          label: "Google Analytics GA4 measurement ID",
          help: "Use G-XXXXXXXXXX. Overrides the Vercel NEXT_PUBLIC_GA_ID fallback on new page loads. Save an empty value to disable analytics.",
        },
      ]}
    >
      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 space-y-2">
        <p>
          <strong>Maps:</strong> Nearby search uses browser location and
          distance calculations; there is no active Google Maps API integration.
          No key is needed.
        </p>
        <p>
          <strong>Payments:</strong> Stripe is not integrated. Saving a
          publishable key would not enable payments.
        </p>
        <p>
          <strong>reCAPTCHA:</strong> Keep the public site key in Vercel and the
          secret key in Render. This dashboard never exposes the secret.
        </p>
      </div>
    </SettingsEditor>
  );
}
