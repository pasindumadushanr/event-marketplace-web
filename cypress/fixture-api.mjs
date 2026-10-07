// Test-only API for server-rendered pages. Browser API calls are intercepted by
// the specs. Never used by production or deployment start commands.
import { createServer } from "node:http";
const business = {
  id: "vendor-test",
  name: "Sunrise Photography",
  description: "Wedding photography in Colombo",
  status: "ACTIVE",
  vendorStatus: "APPROVED",
  phone: "0771234567",
  email: "test@example.com",
  address: "Colombo",
  city: "Colombo",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  category: { id: "photo", name: "Photography" },
  packages: [],
  galleries: [],
  reviews: [],
  unavailableDates: ["2099-01-01"],
  profileSettings: {
    policies: { bookingPolicy: "Contact us before booking" },
    hours: [],
  },
};
createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.url?.startsWith("/discovery/vendors/vendor-test"))
    response.end(JSON.stringify(business));
  else if (request.url === "/discovery/sitemap")
    response.end(
      JSON.stringify([
        { slug: business.id, updatedAt: "2026-10-05T00:00:00Z" },
      ]),
    );
  else if (request.url === "/business-categories")
    response.end(
      JSON.stringify([
        {
          id: "photo",
          name: "Photography",
          slug: "photography",
          parentId: null,
          status: "ACTIVE",
          businessCount: 1,
        },
      ]),
    );
  else if (request.url === "/admin/cms/public/blog")
    response.end(
      JSON.stringify([
        {
          slug: "wedding-guide",
          title: "Wedding Planning Guide",
          excerpt: "Plan your Sri Lankan wedding.",
          publishedAt: "2026-10-05T00:00:00Z",
        },
      ]),
    );
  else if (request.url === "/admin/cms/public/blog/wedding-guide")
    response.end(
      JSON.stringify({
        slug: "wedding-guide",
        title: "Wedding Planning Guide",
        excerpt: "Plan your Sri Lankan wedding.",
        content: "<p>Wedding planning in Sri Lanka</p>",
        publishedAt: "2026-10-05T00:00:00Z",
      }),
    );
  else if (
    request.url?.startsWith("/discovery/search?categorySlug=photography")
  )
    response.end(
      JSON.stringify({
        data: [{ ...business, rating: 0, reviewCount: 0, startingPrice: 0 }],
        meta: { total: 1, page: 1, totalPages: 1 },
      }),
    );
  else if (request.url?.startsWith("/discovery/search"))
    response.end(
      JSON.stringify({ data: [], meta: { total: 0, page: 1, totalPages: 0 } }),
    );
  else {
    response.statusCode = 404;
    response.end("{}");
  }
}).listen(3021, "127.0.0.1", () => console.log("Test fixture API on 3021"));
