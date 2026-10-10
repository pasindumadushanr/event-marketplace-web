import { DEFAULT_PLATFORM } from "../../src/lib/platform-settings";
function adminVisit(path: string) {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-admin");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "admin",
          firstName: "Owner",
          email: "owner@example.com",
          roleName: "SUPER_ADMIN",
        }),
      );
    },
  });
}
describe("Connected admin settings", () => {
  beforeEach(() => {
    cy.intercept("GET", "**googletagmanager.com/gtag/js*", { body: "" });
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: DEFAULT_PLATFORM,
    });
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
  });
  it("reads owner SEO settings into server-rendered homepage metadata", () => {
    cy.request("/").then(({ body }) => {
      const doc = new DOMParser().parseFromString(body, "text/html");
      expect(doc.title).to.equal(
        "Nakathata.lk | Owner-reviewed wedding marketplace",
      );
      expect(
        doc.querySelector('meta[name="description"]')?.getAttribute("content"),
      ).to.contain("Owner-edited search description");
      expect(
        doc.querySelector('meta[property="og:title"]')?.getAttribute("content"),
      ).to.equal(doc.title);
    });
  });
  it("uses general contact details and shared social links on public pages", () => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: {
        ...DEFAULT_PLATFORM,
        general: {
          ...DEFAULT_PLATFORM.general,
          siteName: "Wedding Studio",
          contactEmail: "help@example.com",
          supportPhone: "+94771112233",
          contactAddress: "Matara, Sri Lanka",
        },
        social: {
          ...DEFAULT_PLATFORM.social,
          instagram: "https://instagram.com/owner",
          facebook: "",
          tiktok: "",
          youtube: "",
        },
      },
    });
    cy.visit("/contact");
    cy.get('a[href="mailto:help@example.com"]').should("be.visible");
    cy.get('a[href="tel:+94771112233"]').should("be.visible");
    cy.contains("Matara, Sri Lanka").should("be.visible");
    cy.get('footer a[href="https://instagram.com/owner"]').should("exist");
    cy.get("footer").should("contain", "Wedding Studio");
    cy.get('footer a[aria-label*="Facebook"]').should("not.exist");
    cy.visit("/faq");
    cy.get('a[href="mailto:help@example.com"]').should("exist");
  });
  it("saves real general fields and keeps LKR fixed", () => {
    cy.intercept("GET", "**/admin/cms/settings/general", {
      body: DEFAULT_PLATFORM.general,
    });
    cy.intercept("POST", "**/admin/cms/settings/general", (req) => {
      req.reply({ body: req.body.value });
    }).as("save");
    adminVisit("/admin/settings/general");
    cy.get("#setting-siteName").clear().type("Wedding Studio");
    cy.get("#setting-currency").should("have.attr", "readonly");
    cy.contains("button", "Save changes").click();
    cy.wait("@save")
      .its("request.body.value")
      .should("deep.equal", {
        ...DEFAULT_PLATFORM.general,
        siteName: "Wedding Studio",
      });
  });
  it("blocks saves after loading fails and supports retry", () => {
    cy.intercept("GET", "**/admin/cms/settings/seo", { statusCode: 500 });
    adminVisit("/admin/settings/seo");
    cy.get('[role="alert"]').should("contain", "Saving is disabled");
    cy.contains("button", "Save changes").should("not.exist");
    cy.intercept("GET", "**/admin/cms/settings/seo", {
      body: DEFAULT_PLATFORM.seo,
    });
    cy.contains("button", "Try again").click();
    cy.get("#setting-metaTitle").should(
      "have.value",
      DEFAULT_PLATFORM.seo.metaTitle,
    );
  });
  it("requires the current backend before changing settings", () => {
    cy.intercept("GET", "**/admin/cms/settings/general", {
      body: DEFAULT_PLATFORM.general,
    });
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      statusCode: 404,
    });
    adminVisit("/admin/settings/general");
    cy.get('[role="alert"]').should("contain", "latest backend");
    cy.contains("button", "Save changes").should("not.exist");
  });
  it("shows actual email configuration without exposing passwords and tests own account only", () => {
    cy.intercept("GET", "**/admin/cms/settings/email", {
      body: { fromName: "Wedding Studio" },
    });
    cy.intercept("GET", "**/admin/cms/email/status", {
      body: {
        provider: "resend",
        configured: true,
        fromEmail: "verified@example.com",
      },
    });
    cy.intercept("POST", "**/admin/cms/email/test", {
      body: { accepted: true, recipient: "owner@example.com" },
    }).as("emailTest");
    adminVisit("/admin/settings/email");
    cy.contains("verified@example.com").should("be.visible");
    cy.get('input[type="password"]').should("not.exist");
    cy.contains("button", "Send test to my account email").click();
    cy.wait("@emailTest").its("request.body").should("be.empty");
    cy.contains("Provider accepted a test email").should("be.visible");
  });
  it("does not present mock delivery as real delivery", () => {
    cy.intercept("GET", "**/admin/cms/settings/email", {
      body: { fromName: "Nakathata.lk" },
    });
    cy.intercept("GET", "**/admin/cms/email/status", {
      body: { provider: "mock", configured: false, fromEmail: "" },
    });
    adminVisit("/admin/settings/email");
    cy.contains("Not configured for real email delivery").should("be.visible");
    cy.contains("button", "Send test to my account email").should(
      "be.disabled",
    );
  });
  it("uses saved GA4 instead of the deployment ID without installing two tags", () => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: {
        ...DEFAULT_PLATFORM,
        analytics: { googleAnalyticsId: "G-12345ABCDE" },
      },
    });
    cy.intercept("GET", "**googletagmanager.com/gtag/js*", { body: "" });
    cy.visit("/contact");
    cy.get('script[src*="googletagmanager.com/gtag/js"]')
      .should("have.length", 1)
      .and("have.attr", "src")
      .and("contain", "G-12345ABCDE");
    cy.get("#_next-ga-init").should("contain", "G-12345ABCDE");
  });
  it("saving an empty GA4 ID disables tracking on the next page load", () => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "" } },
    }).as("platform");
    cy.visit("/contact");
    cy.wait("@platform");
    cy.get('script[src*="googletagmanager.com/gtag/js"]').should("not.exist");
  });
});
