import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { DEFAULT_SEO } from "@/lib/platform-settings";
export default function SeoSettingsPage() {
  return (
    <SettingsEditor
      settingKey="seo"
      title="SEO settings"
      description="Controls homepage title, description, social previews, and default metadata. Pages with their own metadata keep their page-specific text. Allow about a minute for the website cache; Google updates on its own schedule."
      defaults={DEFAULT_SEO}
      fields={[
        { key: "metaTitle", label: "Homepage / default title" },
        {
          key: "metaDescription",
          label: "Homepage / default description",
          multiline: true,
        },
        {
          key: "keywords",
          label: "Keywords",
          help: "Comma-separated. Keywords do not guarantee Google rankings.",
        },
      ]}
    />
  );
}
