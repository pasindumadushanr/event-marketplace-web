# Public content editing

## Admin use

- **CMS → FAQ** manages the public `/faq` questions. Active questions are visible; hidden questions are not returned by the public API. Lower sort orders appear first. Search and category buttons use the active questions.
- **CMS → Terms / Privacy** opens the editor for `/terms` and `/privacy`.
- **Save Draft** stores editor changes without replacing the last published page.
- **Preview** shows unsaved editor content privately, without making a network write.
- **Publish Now**, followed by confirmation, replaces the public copy and its last-updated date.
- Failed loads block editing; failed saves retain your unsaved text. Missing policies open starting copy as an unsaved draft, not an automatic database write.

Existing admin-written content is preserved. Review any old statements about escrow, deposits, refunds, payment gateways, or vendor verification before publishing. The starting wording is not a substitute for owner/legal review and must match actual operations at launch.

## Deployment and caching

Deploy the backend before the frontend. No database migration is required: published copies are stored transactionally in private `Setting` records using `CMS_PUBLISHED:<slug>`. That namespace cannot be overwritten through the generic settings endpoint or read through the public settings endpoint. Policy slugs cannot be renamed or deleted.

The editor checks the new public FAQ endpoint before saving a page. If the backend is still on the previous version or unavailable, it refuses the write and retains the draft. This prevents an old backend from replacing live policy content during a staggered deployment.

The public policy routes use the published-copy endpoint. Initial HTML and search metadata refresh through Next.js revalidation (60 seconds); browser visits also fetch the current published copy. A draft save does not update the published timestamp. Failed regeneration keeps the last successful server page, and browser refresh failures keep the last published browser copy. A first-time unpublished policy uses starting text without a fabricated publication date. Content-service failures can prevent a new deployment build; keep the prior deployment live and retry once the backend is available.

Public FAQ responses contain active questions only. Browser storage retains the last successful public list for temporary outages. A successful empty response is respected: it does not bring back deleted or hidden questions. Without a cached list during an outage, reviewed starting help text is shown with an availability notice.

Policy HTML is sanitized using a restrictive formatting/link allowlist on both server-rendered public content and private previews. Scripts, images, inline styles, event handlers, and unsafe URL schemes are removed.

## Checks

- Backend `cms-publication.spec.ts`: publication boundaries, date preservation, URL/deletion protection, admin guards, FAQ filtering, and input validation.
- Frontend `scripts/cms-content.test.mjs`: HTML safety and FAQ grouping.
- Browser `32_cms_publication.cy.ts`: draft/preview/publish, FAQ editing/visibility, cache fallback, failed saves, and narrow mobile layout.
