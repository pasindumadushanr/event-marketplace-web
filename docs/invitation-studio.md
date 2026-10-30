# Invitation Studio — first milestone

## Scope

Standalone staff workspace at `/invitation-studio` with its own `/invitation-studio/login` screen and sessionStorage token (separate from marketplace localStorage/auth state). Authorized roles: `INVITATION_STAFF`, `SUPER_ADMIN`, and an `ADMIN` with an explicit `InvitationStudioMember` record. Marketplace administrators do not automatically get studio access. VENDOR and CUSTOMER roles cannot use the studio API even if a membership row were accidentally present. Password sign-in requires an emailed code; Google login cannot bypass that requirement. The owner requested using the existing website admin credentials; no password or marketplace role is changed to provide this access.

Public catalogue: `/invitation-templates`. First template: W01 Olive & Ivory at LKR 2,500, adapted from the supplied calla-lily sample. Demo: `/invitation-templates/w01`. Only W01 is available; basic LKR 1,500 designs and further templates are future work, not advertised as ready.

### Original design fidelity

W01 now reuses the supplied `sample-invitation/dist/index.html`, `app.js`, `style.css`, `cinematic.css`, `desktop.css` and artwork under `public/invitation-assets/w01`. All three original stylesheets and both source images are byte-identical copies. The original floral seal, photo → date → crest sequence, desktop typography and full invitation layout are preserved. The earlier recreated React design/stylesheet was removed.

An isolated same-origin frame prevents marketplace CSS from restyling the source document. The frame accepts content only from its parent origin/window. Its restrictive CSP permits the original font/image resources but no external scripts or network API calls. The source HTML only adds noindex/initial-loading safeguards and a content adapter; animation logic is retained with limited changes for dynamic names/date, parent-page sharing, personalised card export, and WhatsApp replies.

The public demo retains the original fictional details and browser-only sample RSVP form (no messages sent). Real invitations receive studio data through text nodes, not HTML injection. Their RSVP form prepares a WhatsApp reply; guests still must send it in WhatsApp. Published invitations do not reuse the sample's invented event times, dress code or RSVP deadline. Sample venue imagery is replaced with the couple's uploaded photo until a dedicated venue-photo field is implemented. Optional galleries are added only for real invitations that have uploaded images.

## Workflow

1. Sign in using an authorized staff account. An existing SUPER_ADMIN can use this separate login without a new account.
2. Save the team's sales WhatsApp number in the studio. It powers the catalogue ordering button. This is distinct from each couple's RSVP number.
3. Click Create invitation → choose a template → Use W01. The template picker shows only implemented designs, with price and a live-demo link. No draft is created until its editor is saved. Then pick the permanent slug, enter names/details and upload photos. Existing invitations open directly in their editor. Dates use Sri Lanka time (UTC+05:30).
4. Save draft and preview. A draft save does **not** change a published invitation.
5. Create a customer review link. The random token stays in the URL fragment, is sent in a POST body, stored hashed on the server and expires after seven days. Saving edits, republishing, archiving or unpublishing revokes it. A new review link also replaces the previous token.
6. After customer approval, check the approval box and Publish. The saved content is copied to a separate published snapshot at `/wedding/<slug>`.
7. Unpublish/archive switches off the public URL without deleting the draft. Edits use a revision number to prevent stale tabs overwriting newer work.

RSVP opens WhatsApp with an editable message. It does not store attendance or claim a message was sent. The 1080 × 1350 PNG card uses the same names, date/time and venue. Card images are not clickable; send the site link in the accompanying WhatsApp message. Music is an optional browser-generated melody started by a guest tap.

## Privacy

Draft API reads require staff authorization. Customer review links are bearer links: anyone receiving the full link can view the draft until expiry/revocation. Published invitations are also forwardable and are not password-protected. Invitation pages have noindex headers/metadata and are not included in the sitemap. Analytics is not initialized on studio, review or published invitation routes. Uploaded Cloudinary image URLs are public; do not promise confidential photo storage. Use photos with customer permission.

## Deployment — not automatically applied

1. Confirm the intended production database using the backend's actual `DATABASE_URL`, and review pending migration history/backups first. Do not assume a separately connected Neon project is the application database.
2. Apply `20261030000000_invitation_studio` through the project's reviewed deployment process. It adds `WeddingInvitation`, `InvitationStudioMember` and the invitation-only role; no marketplace data is deleted or reassigned. The existing production database has no `_prisma_migrations` table. Do not run the entire legacy migration history blindly. `scripts/setup-invitation-production.cjs --apply-invitation-studio` is the owner-approved, target-checked additive setup for this database; it also grants the single existing active ADMIN explicit studio membership without changing credentials or its role.
3. Generate Prisma Client, build and deploy the backend. Build/install uses the schema; production still needs the table migration. Existing Cloudinary and SMTP/Resend settings are reused.
4. Deploy frontend with its normal API URL. New routes are not added to marketplace navigation yet, so the service can be reviewed before promotion.
5. Use the existing website ADMIN credentials after explicit studio membership is granted, with the normal email code. A SUPER_ADMIN can also sign in. To provision a *new* invitation-only employee account later, explicitly run `node scripts/create-invitation-staff.cjs --create-invitation-staff` with `STUDIO_STAFF_EMAIL`, `STUDIO_STAFF_NAME`, and a unique `STUDIO_STAFF_PASSWORD` (14+ characters) set privately in the operator environment. The script refuses to overwrite/reassign existing users and never prints the password. Do not run it automatically on deploy. Remove those temporary environment variables afterward.
6. Set ordering WhatsApp, create an internal test invitation, approve/publish, verify its WhatsApp preview on a real device, download its card, and test unpublish before taking orders.

## Deliberate limits

No customer accounts/editor, checkout, payment verification, attendance database, automated billing/expiry, video generation, or extra templates. Payments/revisions/hosting duration remain manual business decisions. Initial list shows latest 200 invitations. No database-backed production or real WhatsApp preview test has been performed until deployment setup is authorized.

## Verification

Backend invitation tests cover content/URL validation, publish approval, private drafts, separate published snapshots, stale revisions, review expiry/revocation and HTTP roles. Browser spec `39_invitation_studio.cy.ts` covers the catalogue, staff OTP login/session isolation, mobile editing, save failures, approval gating, review token handling, public metadata and PNG export using isolated fixtures. Existing marketplace regression tests remain in CI.
