import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { DEFAULT_GENERAL } from "@/lib/platform-settings";
export default function GeneralSettingsPage() {
  return (
    <SettingsEditor
      settingKey="general"
      title="General settings"
      description="Controls public branding, Contact and FAQ support details, and the destination for contact-form email notifications."
      defaults={DEFAULT_GENERAL}
      fields={[
        {
          key: "siteName",
          label: "Site name",
          help: "Used in logo labels, default copyright, search metadata and organization information. Text embedded inside the logo image does not change.",
        },
        {
          key: "contactEmail",
          label: "Support email",
          type: "email",
          help: "Public contact address and recipient of new contact-form notifications.",
        },
        {
          key: "supportPhone",
          label: "Support phone",
          type: "tel",
          help: "Shown on Contact. Leave empty to direct users to the contact form instead.",
        },
        { key: "contactAddress", label: "Contact address / service area" },
        {
          key: "currency",
          label: "Currency",
          readOnly: true,
          help: "LKR only. Changing a currency label would not convert existing prices.",
        },
      ]}
    />
  );
}
