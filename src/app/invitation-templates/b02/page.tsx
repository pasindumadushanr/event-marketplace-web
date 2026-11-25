import { BirthdayRewind } from "@/components/invitations/BirthdayRewind";
import { birthdayDemo } from "@/lib/invitations";

export const metadata = {
  title: "Birthday Rewind — Birthday card demo | Nakathata.lk",
  robots: { index: false, follow: true },
};

export default function BirthdayRewindDemo() {
  return <BirthdayRewind content={{
    ...birthdayDemo,
    couplePhoto: "/invitation-assets/b02/memory-sunset.svg",
    gallery: ["/invitation-assets/b02/memory-seaside.svg"],
  }} preview />;
}
