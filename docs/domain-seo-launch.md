# Nakathata.lk domain and SEO launch

## Implemented

The canonical origin is https://nakathata.lk, independent of stale Vercel environment values. Server-side permanent (308) redirects preserve paths and query strings from luxeevents.fun, www.luxeevents.fun and www.nakathata.lk. Keep these domains attached to the same Vercel project with valid DNS and certificates. Remove conflicting Vercel-level redirects, especially any apex-to-www redirect, which would loop with the app's www-to-apex redirect. The optional LEGACY_DOMAIN_REDIRECT=false disables application redirects for troubleshooting.

Public pages have canonical URLs, descriptions and social previews; vendor and category content is server-rendered. Organization, WebSite, vendor LocalBusiness, breadcrumb and blog article data use real published content. Ratings are not invented. Search/filter pages are noindex; private routes have X-Robots-Tag: noindex, nofollow. Authentication remains the access control; robots rules are not security.

The sitemap includes static public pages, approved published vendor profiles, populated categories and published blog posts. Empty categories are not promoted. API failures retain the static sitemap and log a warning, so investigate missing dynamic entries instead of assuming the sitemap is complete.

## Required dashboard actions

1. Vercel: deploy latest main. Set NEXT_PUBLIC_SITE_URL=https://nakathata.lk for consistency with external integrations. Keep NEXT_PUBLIC_API_URL pointing to Render. Keep all four domain aliases connected; ensure none redirects the canonical apex to www or the old domain.
2. Render: set FRONTEND_URL=https://nakathata.lk and deploy latest backend main. No database migration is needed. Legacy email/sign-in origins also normalize to the official domain in code. Existing old domains remain in CORS during the transition.
3. Google OAuth, if used: add https://nakathata.lk to the frontend's allowed origins. Keep the existing Render API callback URI; do not change it to a frontend URL.
4. Google Search Console: add a Domain property for nakathata.lk, copy Google's exact DNS TXT record into Register.lk and verify it. Submit https://nakathata.lk/sitemap.xml. If you control the old property, use Google's Change of Address tool after redirects are confirmed. Request indexing of the home page and a few real vendor/category pages, not thousands of thin pages.
5. Alternatively, for a URL-prefix Search Console property, set GOOGLE_SITE_VERIFICATION to Google's supplied HTML verification value and redeploy. No verification value is fabricated.

## Verification

Run npm run build, npx tsc --noEmit and the 21_domain_seo.cy.ts suite against the fixture API. After deploying, check both host variants, old-domain deep-link redirects, canonicals, sitemap.xml, robots.txt and a real public profile. Validate structured data with Google's Rich Results Test. Use Search Console to monitor indexing and migration. Google decides whether to display logos or rich results; rankings and indexing dates are not guaranteed.

Grow SEO through useful district/category content and real complete vendor profiles. Avoid fake reviews, keyword stuffing or duplicate empty district pages.
