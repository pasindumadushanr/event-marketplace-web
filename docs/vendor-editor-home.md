# Editor-first vendor home

Implemented locally on 19 November 2026. Not deployed by this task.

- Approved vendors now land directly in the visual business editor at `/vendor`, regardless of a saved V1/V3 dashboard preference.
- `/vendor/preview` remains a working alias using the same extracted editor component, `VisualBusinessEditor`.
- The previous V1/V3 views remain available under “Dashboard & tools” at `/vendor/dashboard`. Existing view preferences still apply there.
- “Setup checklist” links to `/vendor/business` for setup and publishing. Bookings, messages, availability and account links remain accessible.
- Trial and completion notices remain on Dashboard & tools and Account & Help rather than cluttering the editor landing screen.
- Existing application/approval guidance still handles not-started, pending, needs-information and rejected applications. Failed status checks do not expose the editor. Existing backend authorization and publishing rules are unchanged.
- Editing, customer preview, explicit save, unsaved-change guards and publication state are preserved. Landing on the editor does not automatically publish or save anything.

Verification: TypeScript and production webpack build passed. All 19 selected Chrome browser tests passed: nine editor-home cases (including saving without visibility writes, pending-state screens, failed status check and narrow mobile navigation) and ten existing V3 dashboard cases on its new route.

The unrelated, unfinished monitoring changes and user-supplied hero assets remain untouched. No database or production data was changed.

## Mobile profile order

The public profile and visual editor now share a mobile ordering map: hero, contact (including the existing public WhatsApp/shortlist panel), about, gallery, packages, reviews, location, features, availability, hours, FAQs, policies. Desktop retains the existing columns and within-column order. The editor-only booking-disabled note follows the profile sections on mobile.

Empty public gallery, FAQ and feature sections are hidden; the editor retains add/edit placeholders. A null child in customer-preview mode no longer leaves an empty editable wrapper. No contact links or publication logic were changed.

TypeScript/production build checks passed. Six Chrome checks passed for actual mobile positions on both views, customer preview, empty optional content, preserved desktop columns and package WhatsApp behavior. These changes are local and have not been deployed.
