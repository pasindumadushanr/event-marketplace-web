import { SettingsEditor } from "@/components/admin/SettingsEditor";
export default function FooterSettingsPage() {
  return (
    <SettingsEditor
      settingKey="FOOTER_CONTENT"
      title="Footer content"
      description="Edit footer copy. Social links are managed centrally in Social media links."
      defaults={{ description: "", copyright: "", subtext: "" }}
      fields={[
        {
          key: "description",
          label: "Brand description",
          multiline: true,
          help: "Appears below the logo. Empty uses the default description.",
        },
        {
          key: "copyright",
          label: "Copyright text",
          help: "Leave empty for the current year and the site name from General settings.",
        },
        {
          key: "subtext",
          label: "Footer tagline",
          help: "Empty uses the default tagline.",
        },
      ]}
    />
  );
}
