import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online payments unavailable | Nakathata.lk",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
