import { BirthdayExperience } from "@/components/invitations/BirthdayExperience";
import { birthdayDemo } from "@/lib/invitations";

export const metadata = {
  title: "Make a Wish — Birthday card demo | Nakathata.lk",
  robots: { index: false, follow: true },
};

export default function BirthdayDemo() {
  return <BirthdayExperience content={birthdayDemo} preview />;
}
