import Link from "next/link";
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
          key: "prelaunchBanner",
          label: "Pre-launch cover banner (Launch Jan 1, 2027)",
          options: [
            {
              value: "enabled",
              label: "Enabled — Show Launching Jan 1, 2027 cover banner with countdown & close icon",
            },
            {
              value: "disabled",
              label: "Disabled — Standard full marketplace homepage",
            },
          ],
          help: "Controls the pre-launch cover banner on the homepage. When enabled, visitors see the countdown, vendor registration button, and notify-me form, with a close (X) icon to preview the website. Set to Disabled when you are ready to open the full marketplace.",
        },
        {
          key: "homepageVersion",
          label: "Homepage version",
          options: [
            { value: "v1", label: "Home V1 — Original design" },
            { value: "v2", label: "Home V2 — Simple design" },
          ],
          help: "Choose the main homepage, then save. Changes can take about a minute to appear. Requires the latest backend on Render.",
        },
        {
          key: "siteName",
          label: "Site name",
          help: "Used in logo labels, default copyright, search metadata and organization information. Text embedded inside the logo image does not change.",
        },
        {
          key: "contactEmail",
          label: "General enquiries email",
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
    >
      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/home-v1"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Preview Home V1
        </Link>
        <Link
          href="/home-v2"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Preview Home V2
        </Link>
      </div>
    </SettingsEditor>
  );
}
