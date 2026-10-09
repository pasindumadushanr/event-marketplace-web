export interface PolicyPage {
  slug: string;
  title: string;
  content: string;
  updatedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Owner-review starting copy. Never automatically saved or published in the CMS.
export const policyDefaults: Record<string, PolicyPage> = {
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms of Service",
    content: `<h2>1. About the marketplace</h2>
<p>Nakathata.lk helps customers discover wedding and event vendors in Sri Lanka and send inquiries. Using the website means agreeing to these terms.</p>
<h2>2. Accounts and listings</h2>
<p>Provide accurate information, keep your password secure, and only upload content you have permission to use. Vendors are responsible for their listing information, prices, availability, and services. Profile approval is not a guarantee of service quality, identity, or qualifications.</p>
<h2>3. Inquiries and bookings</h2>
<p>An inquiry does not reserve a date or confirm a booking. Confirm availability, services, prices, payment arrangements, and cancellation terms directly with the vendor in writing before making a commitment.</p>
<h2>4. Payments and cancellations</h2>
<p>Do not treat test payment screens or payment-status labels as proof of a real payment. Nakathata.lk does not currently provide a live payment gateway, escrow service, standardized 15% deposit, or platform refund guarantee. Any payment made directly to a vendor is subject to your agreement with that vendor. Ask for the vendor's cancellation and refund terms before paying.</p>
<h2>5. Responsible use</h2>
<p>Do not submit fraudulent listings, fabricated reviews, abusive messages, or content that infringes others' rights. We may restrict accounts or listings to protect the marketplace.</p>
<h2>6. Help and updates</h2>
<p>For questions about the platform, use our <a href="/contact">Contact page</a>. We may update these terms; the published update date appears above.</p>`,
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `<h2>1. Information you provide</h2>
<p>We process account and contact details, vendor profile information and media, inquiries, and other information you submit to operate Nakathata.lk. Public vendor listing details and business locations can be viewed by visitors. Avoid including sensitive personal information in public listings or messages.</p>
<h2>2. How information is used</h2>
<p>We use information to operate accounts and listings, connect customers and vendors, send service notifications, handle support requests, improve the website, and help prevent misuse. Sending an inquiry shares its contents and relevant contact details with the intended vendor.</p>
<h2>3. Cookies, analytics, and service providers</h2>
<p>The website uses browser storage for account sessions and preferences. Google Analytics measures website use and may set analytics cookies and process device and interaction information. Hosting, storage, email, and analytics providers process information needed to deliver these services. Your browser can restrict cookies and storage, though some features may not work.</p>
<h2>4. Optional nearby search</h2>
<p>When you choose Use my location and grant browser permission, your coordinates are sent to our server to find vendors within 50 km. They remain in page memory, are not saved to your account, and are not intentionally recorded in application logs or analytics. Turning off nearby search or leaving the page stops their use. Vendor business coordinates are saved when the vendor saves their profile and are public business-location information.</p>
<h2>5. Spam prevention</h2>
<p>Google reCAPTCHA helps protect forms against automated abuse. Google may process IP address, browser information, and interaction signals. Google's <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>
<h2>6. Security and your requests</h2>
<p>We use access controls and other safeguards, but no online service can guarantee absolute security. Do not send card numbers, security codes, banking PINs, or passwords in inquiries. You can update available profile details in account settings and contact us about access, correction, or deletion requests. Some information may need to be retained for security, dispute handling, or other applicable requirements.</p>
<h2>7. Contact and updates</h2>
<p>For privacy questions, use our <a href="/contact">Contact page</a>. The published update date appears above when this policy is published through the admin editor.</p>`,
  },
};

export function pagePublicPath(slug: string) {
  return slug === "terms-and-conditions"
    ? "/terms"
    : slug === "privacy-policy"
      ? "/privacy"
      : `/${slug}`;
}

export function isPolicySlug(slug: string) {
  return Object.hasOwn(policyDefaults, slug);
}
