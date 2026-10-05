import { mapBusinessData } from "../../lib/map-business-profile";

export type SetupIssue = { label: string; href: string };
const filled = (value: unknown) => typeof value === "string" && !!value.trim();

// A review belongs to the saved content, not simply a visit to the preview.
export function previewSignature(
  business: any,
  packages: any[],
  galleries: any[] = [],
) {
  const { setupReview: _review, ...settings } = business.profileSettings || {};
  settings.faqs = settings.faqs || settings.faq;
  delete settings.faq;
  settings.features = mapBusinessData(business)?.featureGroups || [];
  const policies = { ...(settings.policies || {}) };
  for (const key of ["booking", "cancellation", "payment"]) {
    policies[`${key}Policy`] = policies[`${key}Policy`] ?? policies[key] ?? "";
    delete policies[key];
  }
  settings.policies = policies;
  const canonical = (value: any): any => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .filter((key) => {
            const item = value[key];
            return (
              item !== undefined &&
              item !== null &&
              item !== "" &&
              !(Array.isArray(item) && !item.length) &&
              !(typeof item === "object" && !Object.keys(item).length)
            );
          })
          .map((key) => [key, canonical(value[key])]),
      );
    return value;
  };
  const content = JSON.stringify([
    ...[
      "name",
      "description",
      "logo",
      "coverImage",
      "phone",
      "email",
      "address",
      "city",
      "district",
      "province",
      "zipCode",
      "startingPrice",
      "categoryId",
      "website",
      "facebook",
      "instagram",
      "youtube",
      "googleMapLocation",
    ].map((key) => business[key] ?? ""),
    canonical(settings),
    [...packages]
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
      .map((item) => [
        item.id,
        item.name,
        item.description || "",
        Number(item.price),
        item.duration || "",
        item.image || "",
        item.features || [],
        item.status,
      ]),
    [...galleries]
      .sort((a, b) => String(a.id).localeCompare(String(b.id)))
      .map((item) => [item.id, item.url, item.type, item.sortOrder ?? 0]),
  ]);
  let hash = 2166136261;
  for (let i = 0; i < content.length; i++)
    hash = Math.imul(hash ^ content.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}

export function setupProgress(
  business: any,
  packages: any[],
  account: any,
  galleries: any[] = [],
) {
  const missing = (fields: [unknown, string, string][]) =>
    fields
      .filter(([value]) => !filled(value))
      .map(([, label, href]) => ({ label, href }));
  const details = missing([
    [business.name, "Add your business name", "/vendor/business/general"],
    [
      business.description,
      "Write a short business introduction",
      "/vendor/business/general",
    ],
    [
      business.address,
      "Add your business address",
      "/vendor/business/location",
    ],
    [business.city, "Choose your city", "/vendor/business/location"],
  ]);
  const photos = missing([
    [business.logo, "Upload your business logo", "/vendor/business/general"],
    [business.coverImage, "Upload a cover photo", "/vendor/business/general"],
  ]);
  const contact = missing([
    [business.phone, "Add a phone number", "/vendor/business/contact"],
    [
      business.email,
      "Add a business email address",
      "/vendor/business/contact",
    ],
  ]);
  const servicesDone =
    packages.some((item) => item.status === "ACTIVE") ||
    business.profileSettings?.booking?.bookingMethod === "CONTACT_ONLY" ||
    business.profileSettings?.bookingMethod === "CONTACT_ONLY";
  const reviewed =
    business.profileSettings?.setupReview?.signature ===
    previewSignature(business, packages, galleries);
  const blockers: SetupIssue[] = [...details, ...photos, ...contact];
  if (!filled(business.profileSettings?.policies?.bookingPolicy))
    blockers.push({
      label: "Explain your booking policy",
      href: "/vendor/business/policies",
    });
  if (account?.vendorStatus !== "APPROVED")
    blockers.push({
      label: account
        ? "Your vendor application needs approval"
        : "Check your account status — try loading again",
      href: "/vendor/onboarding",
    });
  if (account && !account.emailVerified)
    blockers.push({
      label: "Verify your account email before publishing",
      href: "/vendor/verify-email",
    });
  if (!reviewed)
    blockers.push({
      label: "Review your saved page as a customer",
      href: "/vendor/preview",
    });
  return {
    canPublish: blockers.length === 0,
    blockers,
    steps: [
      {
        title: "Business details",
        href: "/vendor/business/general",
        done: !details.length,
        issues: details,
        hint: "Introduce your business and tell customers where you work.",
      },
      {
        title: "Photos",
        href: "/vendor/gallery",
        done: !photos.length,
        issues: photos,
        hint: "Logo and cover added. Portfolio photos are a great optional extra.",
      },
      {
        title: "Services",
        href: "/vendor/packages",
        done: servicesDone,
        issues: servicesDone
          ? []
          : [
              {
                label:
                  "Add an active service with a title, description and price (recommended)",
                href: "/vendor/packages",
              },
            ],
        hint: "Show customers what you offer. Service cards are recommended, not required to publish.",
      },
      {
        title: "Contact",
        href: "/vendor/business/contact",
        done: !contact.length,
        issues: contact,
        hint: "Make it easy for customers to reach you.",
      },
      {
        title: "Preview",
        href: "/vendor/preview",
        done: reviewed,
        issues: reviewed
          ? []
          : [
              {
                label:
                  "Choose View as customer, then confirm you have checked the page",
                href: "/vendor/preview",
              },
            ],
        hint: "Your current saved page has been reviewed.",
      },
      {
        title: "Publish",
        href: "/vendor/business#business-setup",
        done: business.status === "ACTIVE",
        issues: business.status === "ACTIVE" ? [] : blockers,
        hint:
          business.status === "ACTIVE"
            ? "Your page is visible to customers."
            : blockers.length
              ? "Finish these requirements to make your page visible."
              : "Your page is ready. Publish when you are happy with it.",
      },
    ],
  };
}
