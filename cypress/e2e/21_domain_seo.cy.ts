import { jsonLd } from "../../src/lib/seo";
describe("Official domain and technical SEO", () => {
  it("declares crawlable emblem favicons while preserving the full organization logo", () => {
    cy.request("/").then((response) => {
      const doc = new DOMParser().parseFromString(response.body, "text/html");
      expect(
        doc
          .querySelector(
            'link[rel="icon"][href="/images/brand/favicon-96.png"]',
          )
          ?.getAttribute("sizes"),
      ).to.equal("96x96");
      expect(
        doc.querySelector('link[rel="icon"][href="/favicon.ico"]'),
      ).not.to.equal(null);
      expect(
        doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href"),
      ).to.equal("/images/brand/favicon-180.png");
      expect(response.body).to.contain(
        "https://nakathata.lk/images/brand/nakathata-logo.jpg",
      );
    });
    for (const path of [
      "/favicon.ico",
      "/images/brand/favicon-96.png",
      "/images/brand/favicon-180.png",
      "/images/brand/favicon-512.png",
    ]) {
      cy.request({ url: path, encoding: "binary" }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.headers["content-type"]).to.contain("image/");
        expect(response.body.length).to.be.lessThan(300000);
      });
    }
  });
  it("uses self-referencing canonicals and social URLs on public pages", () => {
    for (const path of [
      "/",
      "/categories",
      "/locations",
      "/contact",
      "/about",
      "/faq",
      "/blog",
    ]) {
      cy.request(path).then((response) => {
        const doc = new DOMParser().parseFromString(response.body, "text/html");
        expect(
          new URL(
            doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
              "",
          ).href,
        ).to.equal(new URL(`https://nakathata.lk${path}`).href);
        expect(
          new URL(
            doc
              .querySelector('meta[property="og:url"]')
              ?.getAttribute("content") || "",
          ).href,
        ).to.equal(new URL(`https://nakathata.lk${path}`).href);
        expect(
          doc.querySelector('meta[name="description"]')?.getAttribute("content")
            ?.length,
        ).to.be.greaterThan(30);
        const organization = [
          ...doc.querySelectorAll('script[type="application/ld+json"]'),
        ]
          .map((item) => JSON.parse(item.textContent || "{}"))
          .filter((item) => item["@type"] === "Organization");
        expect(organization).to.have.length(1);
        expect(organization[0].url).to.equal("https://nakathata.lk");
      });
    }
  });
  it("serves only official public URLs in sitemap and robots", () => {
    cy.request("/sitemap.xml")
      .its("body")
      .should("contain", "https://nakathata.lk/business/vendor-test")
      .and("contain", "https://nakathata.lk/c/photography")
      .and("contain", "https://nakathata.lk/blog/wedding-guide")
      .and("not.contain", "luxeevents")
      .and("not.contain", "/search")
      .and("not.contain", "/vendor/preview");
    cy.request("/robots.txt")
      .its("body")
      .should("contain", "Sitemap: https://nakathata.lk/sitemap.xml")
      .and("contain", "Disallow: /admin");
  });
  it("permanently redirects old-domain and www paths, preserving query strings", () => {
    for (const host of [
      "luxeevents.fun",
      "www.luxeevents.fun",
      "www.nakathata.lk",
    ])
      cy.request({
        url: "/contact?source=migration",
        headers: { Host: host },
        followRedirect: false,
      }).then((res) => {
        expect(res.status).to.equal(308);
        expect(res.headers.location).to.equal(
          "https://nakathata.lk/contact?source=migration",
        );
      });
  });
  it("prevents private pages and filter-result pages from being indexed", () => {
    for (const path of [
      "/admin",
      "/vendor",
      "/account",
      "/checkout/mock",
      "/auth/callback",
      "/login",
      "/register",
    ])
      cy.request(path)
        .its("headers")
        .its("x-robots-tag")
        .should("equal", "noindex, nofollow");
    cy.request("/search?city=Colombo")
      .its("body")
      .should("contain", "noindex, follow");
  });
  it("renders category content and specific metadata before JavaScript", () => {
    cy.request("/c/photography")
      .its("body")
      .should("contain", "Photography in Sri Lanka | Nakathata.lk")
      .and("contain", "Sunrise Photography")
      .and("contain", "BreadcrumbList")
      .and("contain", "https://nakathata.lk/c/photography");
  });
  it("adds truthful business and article structured data without fabricated ratings", () => {
    cy.request("/business/vendor-test").then((res) => {
      const doc = new DOMParser().parseFromString(res.body, "text/html");
      const business = [
        ...doc.querySelectorAll('script[type="application/ld+json"]'),
      ]
        .map((s) => JSON.parse(s.textContent || "{}"))
        .find((s) => s["@type"] === "LocalBusiness");
      expect(business.name).to.equal("Sunrise Photography");
      expect(business.url).to.equal(
        "https://nakathata.lk/business/vendor-test",
      );
      expect(business).not.to.have.property("aggregateRating");
    });
    cy.request("/blog/wedding-guide")
      .its("body")
      .should("contain", "BlogPosting")
      .and("contain", "https://nakathata.lk/blog/wedding-guide");
    expect(jsonLd({ name: "</script><script>bad</script>" })).not.to.contain(
      "</script>",
    );
  });
});
