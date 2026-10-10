import { SettingsEditor } from "@/components/admin/SettingsEditor";
export default function EmailSettingsPage() {
  return (
    <SettingsEditor
      settingKey="email"
      title="Email settings"
      description="View the actual backend email provider, test delivery to your own account, and change the sender display name. Private provider credentials remain in Render."
      defaults={{ fromName: "Nakathata.lk" }}
      fields={[
        {
          key: "fromName",
          label: "Sender display name",
          help: "Used by the active SMTP or Resend provider for outgoing platform emails. The sender email must be verified with the provider and configured in Render.",
        },
      ]}
    />
  );
}
