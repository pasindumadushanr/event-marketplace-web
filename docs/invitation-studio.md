# Invitation Studio — first milestone

## Scope

Standalone staff workspace at `/invitation-studio` with its own `/invitation-studio/login` screen and sessionStorage token (separate from marketplace localStorage/auth state). Authorized roles: `INVITATION_STAFF` and `SUPER_ADMIN`. Marketplace ADMIN, VENDOR and CUSTOMER roles cannot use the studio API. Password sign-in requires an emailed code; Google login cannot bypass that requirement.

Public catalogue: `/invitation-templates`. First template: W01 Olive & Ivory at LKR 2,500, adapted from the supplied calla-lily sample. Demo: `/invitation-templates/w01`. Only W01 is available; basic LKR 1,500 designs and further templates are future work, not advertised as ready.

## Workflow

1. Sign in using an authorized staff account. An existing SUPER_ADMIN can use this separate login without a new account.
2. Save the team's sales WhatsApp number in the studio. It powers the catalogue ordering button. This is distinct from each couple's RSVP number.
3. Create an invitation, pick its permanent slug, enter names/details and upload photos. Dates use Sri Lanka time (UTC+05:30).
4. Save draft and preview. A draft save does **not** change a published invitation.
5. Create a customer review link. The random token stays in the URL fragment, is sent in a POST body, stored hashed on the server and expires after seven days. Saving edits, republishing, archiving or unpublishing revokes it. A new review link also replaces the previous token.
6. After customer approval, check the approval box and Publish. The saved content is copied to a separate published snapshot at `/wedding/<slug>`.
7. Unpublish/archive switches off the public URL without deleting the draft. Edits use a revision number to prevent stale tabs overwriting newer work.

RSVP opens WhatsApp with an editable message. It does not store attendance or claim a message was sent. The 1080 × 1350 PNG card uses the same names, date/time and venue. Card images are not clickable; send the site link in the accompanying WhatsApp message. Music is an optional browser-generated melody started by a guest tap.

## Privacy

Draft API reads require staff authorization. Customer review links are bearer links: anyone receiving the full link can view the draft until expiry/revocation. Published invitations are also forwardable and are not password-protected. Invitation pages have noindex headers/metadata and are not included in the sitemap. Analytics is not initialized on studio, review or published invitation routes. Uploaded Cloudinary image URLs are public; do not promise confidential photo storage. Use photos with customer permission.

## Deployment — not automatically applied

1. Confirm the intended production database using the backend's actual `DATABASE_URL`, and review pending migration history/backups first. Do not assume a separately connected Neon project is the application database.
2. Apply `20261030000000_invitation_studio` through the project's reviewed Prisma deployment process. It adds `WeddingInvitation` and the invitation-only role; no marketplace data is deleted or reassigned. No migration was applied during development.
3. Generate Prisma Client, build and deploy the backend. Build/install uses the schema; production still needs the table migration. Existing Cloudinary and SMTP/Resend settings are reused.
4. Deploy frontend with its normal API URL. New routes are not added to marketplace navigation yet, so the service can be reviewed before promotion.
5. Test using an existing SUPER_ADMIN first. To provision a *new* invitation-only employee account, explicitly run `node scripts/create-invitation-staff.cjs --create-invitation-staff` with `STUDIO_STAFF_EMAIL`, `STUDIO_STAFF_NAME`, and a unique `STUDIO_STAFF_PASSWORD` (14+ characters) set privately in the operator environment. The script refuses to overwrite/reassign existing users and never prints the password. Do not run it automatically on deploy. Remove those temporary environment variables afterward.
6. Set ordering WhatsApp, create an internal test invitation, approve/publish, verify its WhatsApp preview on a real device, download its card, and test unpublish before taking orders.

## Deliberate limits

No customer accounts/editor, checkout, payment verification, attendance database, automated billing/expiry, video generation, or extra templates. Payments/revisions/hosting duration remain manual business decisions. Initial list shows latest 200 invitations. No database-backed production or real WhatsApp preview test has been performed until deployment setup is authorized.

## Verification

Backend invitation tests cover content/URL validation, publish approval, private drafts, separate published snapshots, stale revisions, review expiry/revocation and HTTP roles. Browser spec `39_invitation_studio.cy.ts` covers the catalogue, staff OTP login/session isolation, mobile editing, save failures, approval gating, review token handling, public metadata and PNG export using isolated fixtures. Existing marketplace regression tests remain in CI.
