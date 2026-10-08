# Optional 50 km nearby discovery

Deploy the backend before testing the frontend. No environment keys, dependencies,
schema changes, seed data, or database migration are required. Business coordinates
are stored as `profileSettings.location = { latitude, longitude }`; clearing the
fields saves `location: null`, preserving other profile settings.

## How to try it

1. In Vendor → Business → Location, enter the actual public business coordinates
   from Google Maps, or use current position only while physically at the business.
   Review the point before Save Changes. Do not guess coordinates from a city name.
2. Ensure that test business is approved and active.
3. Open Search and choose **Use my location · 50 km**. Allow browser location.
   Matching vendors with valid saved coordinates within 50 km appear nearest first.

Geolocation is requested only after a click, not on page load. It is one-time,
not continuous tracking. A denied, unavailable or timed-out location leaves city
search available. The visitor's coordinates stay in page memory and are submitted
only in `POST /discovery/nearby` request bodies, never URLs/local storage. The
endpoint returns `Cache-Control: no-store`, does not echo visitor coordinates, and
application error logging includes paths/error codes only. Do not enable request-
body logging for this endpoint or send coordinates to analytics. Check any hosting
or observability integrations separately if their logging settings change.

The radius is fixed at 50 km. Distances use Haversine straight-line distance, not
driving time or vendor travel/service areas. Missing/invalid vendor coordinates
are excluded from nearby results, but still available in normal search. Browser
position accuracy varies; displayed distances are approximate.

Category/keyword and price/rating ordering work within the radius. Filtering and
sorting happen before pagination. Search now exposes pagination, corrected Clear
Filters behavior, and retryable error states; stale responses cannot overwrite
newer results. Vendor coordinates are public business information, not private
customer locations.

For this initial implementation the backend fetches matching businesses to compute
distance in memory, like existing price/rating sorting. Before large-scale traffic,
move coordinates to indexed numeric/geospatial columns and perform radius filtering
and sorting in PostgreSQL. Do not approximate absent coordinates with district
centers or present them as measured distances.

Tests: backend `geo.spec.ts`, vendor-business save/clear validation tests, frontend
`23_nearby_search.cy.ts` (mock coordinates and APIs, no real permission/account writes).
