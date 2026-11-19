import type { ReactNode } from "react";

// One mobile order for the public page and the vendor's visual editor.
// Desktop sections remain in their existing two-column document order.
export const profileSectionOrder = {
  hero: "order-none",
  contact: "order-0",
  contactAction: "order-1",
  about: "order-2",
  gallery: "order-3",
  packages: "order-4",
  reviews: "order-5",
  location: "order-6",
  features: "order-7",
  availability: "order-8",
  hours: "order-9",
  faq: "order-10",
  policies: "order-11",
  previewNote: "order-12",
} as const;

export function ProfileSection({
  name,
  children,
}: {
  name: keyof typeof profileSectionOrder;
  children: ReactNode;
}) {
  return (
    <div
      data-profile-section={name}
      className={`${profileSectionOrder[name]} min-w-0 empty:hidden lg:order-none`}
    >
      {children}
    </div>
  );
}
