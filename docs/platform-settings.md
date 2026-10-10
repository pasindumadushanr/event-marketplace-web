# Connected platform settings

Deploy the backend first, then the frontend. No database migration is required.
The new settings forms refuse saves if `/admin/cms/public/platform-settings` is
missing or invalid, preventing changes against an older backend deployment.

## What controls what

- General: site name in logo/navigation labels, default footer copyright,
  application/organization metadata; support email on Contact/FAQ and the
  contact-form notification recipient; phone/address on Contact.
- SEO: homepage and root fallback title/description/social previews, global
  keywords. Page-specific metadata remains unchanged. Next's metadata cache
  revalidates every 60 seconds; Google recrawling is independent.
- Social: one canonical setting used by footer, supported Contact networks,
  organization metadata. Existing footer links are used until the social setting
  is saved. Blank links are intentionally hidden. Footer text edits do not
  overwrite shared links; the footer editor links to the social editor.
- Analytics: stored GA4 ID overrides Vercel's `NEXT_PUBLIC_GA_ID`. If no stored
  ID exists, the Vercel value is the fallback. A blank value from the old,
  previously unused integration form also keeps this fallback. Explicitly saving
  an empty ID using the new form disables analytics. Visitors fetch current public settings before initializing
  the single GA tag; changes take effect on new full page loads.
- Email: the saved sender **display name** is passed to the SMTP/Resend provider.
  The sender address/credentials/provider remain deployment managed in Render.
  The dashboard displays actual configuration and can send a rate-limited test
  to the authenticated administrator's own account email. Provider acceptance
  is not a guarantee of inbox delivery.

## Deployment-managed credentials

For email, set `SMTP_PROVIDER=smtp` or `resend`, and `SMTP_FROM_EMAIL` to a verified
sender. SMTP also needs `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`; Resend
needs `RESEND_API_KEY`. Redeploy after environment changes. Mock email is clearly
reported as not ready for real delivery and cannot pass the test-send endpoint.

Old database SMTP credentials are not used and are never returned by either
the private settings reader or the public configuration. New dashboard saves
reject credentials/unsupported fields. A sender-name save replaces the old
email setting with the non-secret name only; no automatic data deletion occurs.
Consider rotating any credential previously entered into the old form.

Google Maps/Stripe fields were removed because those integrations are not
implemented. Nearby search does not require a Google Maps key. reCAPTCHA keys
remain in Vercel/Render. Currency is locked to LKR because changing a label does
not perform currency conversion.

The public aggregate is a whitelist projection; it cannot return email secrets,
private API keys, draft content, or arbitrary settings. Admin saves retain
existing role guards and redacted activity logging. Failed loads block saving
and provide a retry action.

## Checks

Backend: `platform-settings.spec` plus existing critical regression suites.
Frontend: `scripts/platform-settings.test.mjs` and
`cypress/e2e/33_platform_settings.cy.ts` with the isolated fixture API.
The browser fixture intentionally supplies a custom homepage SEO title to
verify server-rendered metadata is sourced from settings, not fixed text.
