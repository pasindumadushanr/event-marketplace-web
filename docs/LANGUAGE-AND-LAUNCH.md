# Gradual language support and nationwide launch

## Phase-one languages

English, Sinhala and Tamil are available in customer/vendor registration, vendor email verification, the vendor onboarding wizard, the saved-profile setup checklist and the customer enquiry form. The selection is remembered in this browser and switching languages does not reset a form draft.

Category names, vendor-written content, other dashboard editors and email templates are not translated in this phase. A localized note explains this limit. Missing translation keys fall back to English; API field names and role values stay unchanged.

Translations live in `src/lib/language.tsx`. Before a public language launch, ask native Sinhala and Tamil readers to review wording, particularly validation messages and publishing instructions. Use the existing browser tests to check mobile layout, draft preservation and request payloads when adding phrases.

## Launch support across all 25 districts

Administrators can open **Launch Support** at `/admin/launch`. The default covers the whole country; an optional district filter includes all 25 districts. Batches contain at most 25 actual registered businesses, ordered oldest first. No seeded vendors, automatic outreach, approvals or visibility changes are performed.

The page highlights basic profile gaps and summarizes structured enquiries received during the last 30 days. The latest recorded vendor action determines each enquiry's status. Normal text replies are not counted as structured actions; older enquiries are outside this reporting window. Counts are labeled for the current batch, not the entire country. Profile checks are help prompts, not proof of identity or publication readiness.

Suggested team workflow:

1. Invite genuine vendors through your usual channels in any district.
2. Work through a batch your team can personally support; help with photos, service cards, contact information and location.
3. Review each vendor's customer preview together. Use the existing application review and vendor publish flows; do not bypass their checks.
4. Ask vendors to handle enquiries in Messages using reply, request more details or decline.
5. Learn from actual questions and vendor difficulties before adding more launch features. No payment work is included.

The new backend route is `GET /admin/vendors/applications/launch-overview`, under the existing authenticated ADMIN/SUPER_ADMIN guards. It returns guidance and counts only, never customer message contents or verification documents. No database migration is needed for this change. Deploy the backend before the frontend; otherwise the new admin page will correctly show a retryable load error.
