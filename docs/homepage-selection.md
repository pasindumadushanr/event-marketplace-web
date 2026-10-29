# Admin homepage selection

- Admin → Settings → General → Homepage version → Save changes.
- `v1` displays ClassicHomepage; `v2` displays SimpleHomepage at `/`.
- The default is V2. The old `HOMEPAGE_DESIGN` environment variable no longer controls the root page.
- Both preview routes remain available from the admin settings page and retain noindex/canonical metadata. They are no longer linked in public navigation.
- The choice is stored with the existing `general` settings record. No database migration is needed.
- Deploy the matching backend before using the new editor. Older backends reject the new field rather than pretending to save it.
- Public server settings are cached for 60 seconds; allow about a minute and reload to see a saved change. Existing branding, SEO, analytics and contact settings are unchanged.
