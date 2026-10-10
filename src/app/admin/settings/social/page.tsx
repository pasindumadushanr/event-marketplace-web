import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { DEFAULT_SOCIAL } from "@/lib/platform-settings";
export default function SocialSettingsPage() {
  return (
    <SettingsEditor
      settingKey="social"
      title="Social media links"
      description="Shared links used by the footer, supported networks on the Contact page, and organization search metadata. Leave a link empty to hide it. HTTPS URLs only."
      defaults={DEFAULT_SOCIAL}
      fields={Object.keys(DEFAULT_SOCIAL).map((key) => ({
        key,
        label: `${key === "twitter" ? "X (Twitter)" : key.charAt(0).toUpperCase() + key.slice(1)} URL`,
        type: "url",
      }))}
    />
  );
}
