# Simple homepage trial

The default homepage now contains only a service/location search, six popular
service links, up to three real vendor profiles, and a small vendor invitation.
Browse by Location, How It Works, statistics, packages and promotional feature
sections are no longer on the main homepage. The existing footer and admin
hero/logo settings are retained. The keyword and nearby-location tools remain
available on the search results page.

Packages remain accessible at `/packages`, and navigation/footer links point
there instead of the removed homepage anchor.

## Compare or restore

The previous section components were not rewritten or deleted. Their exact
composition is preserved in `ClassicHomepage.tsx` and can be compared at
`/home-v1` (also available at `/home-classic`). The simpler layout can be reviewed
at `/home-v2`. Both Home V1 and Home V2 are linked in the desktop and mobile main
navigation for collecting feedback. They are noindex and excluded from the
sitemap; the normal `/` homepage keeps its existing SEO settings. No final
design choice is made by adding these comparison links.

To restore the previous homepage without reverting unrelated work, set
`HOMEPAGE_DESIGN=classic` in Vercel and redeploy. Remove that environment variable
(or set it to `simple`) and redeploy to return to the simpler layout. Homepage
SEO, analytics, public settings, authentication, and vendor data are unchanged.

Legacy design/browser tests continue to exercise the preserved comparison page.
`34_simple_homepage.cy.ts` verifies the new default page and search behavior.
