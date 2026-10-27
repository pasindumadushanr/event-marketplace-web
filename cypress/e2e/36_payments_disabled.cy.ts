import { DEFAULT_PLATFORM } from "../../src/lib/platform-settings";

describe("Launch without online payments", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "" } },
    });
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
  });
  it("routes fixed-price packages and direct-booking profiles to inquiries", () => {
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: {
        id: "vendor-test",
        name: "Wedding Studio",
        status: "ACTIVE",
        category: { name: "Photography" },
        bookingMethod: "DIRECT_BOOKING",
        profileSettings: { bookingMethod: "DIRECT_BOOKING" },
        packages: [
          {
            id: "paid-package",
            name: "Full day photography",
            price: 75000,
            features: [],
          },
        ],
      },
    });
    cy.visit("/business/vendor-test", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", "test-only");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ id: "c1", roleName: "CUSTOMER", firstName: "Test" }),
        );
      },
    });
    cy.contains("button", "Book Now").should("not.exist");
    cy.get('section[aria-label="Contact this vendor"]').should("be.visible");
    cy.contains("button", "Request a Quote").should("not.exist");
    cy.contains("button", "Request this package").click();
    cy.get('[role="dialog"]').should("contain.text", "Full day photography");
    cy.contains("button", "Send enquiry").should("be.visible");
    cy.contains("This does not make a booking or reserve your date.").should(
      "be.visible",
    );
  });
  it("keeps membership details without subscription purchase buttons", () => {
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "APPROVED", emailVerified: true },
    });
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization
        ? req.reply({ body: { id: "vendor-test", name: "Wedding Studio" } })
        : req.continue(),
    );
    cy.intercept("GET", "**/subscriptions/my-subscription", {
      body: { plan: { name: "Launch access" }, endDate: "2099-01-01" },
    });
    cy.visit("/vendor/subscription", {
      onBeforeLoad(win) {
        win.localStorage.setItem("accessToken", "test-only");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ id: "v1", roleName: "VENDOR", firstName: "Test" }),
        );
      },
    });
    cy.contains("Paid subscriptions are not available yet").should(
      "be.visible",
    );
    cy.contains("Launch access").should("be.visible");
    cy.contains("button", "Subscribe Now").should("not.exist");
    cy.contains("button", "Renew Plan").should("not.exist");
    cy.contains("a", "Contact support").should(
      "have.attr",
      "href",
      "/vendor/support",
    );
  });
  for (const route of [
    "/checkout/mock?session_id=old-session",
    "/checkout/success",
    "/checkout/cancel",
    "/checkout/old-booking",
  ]) {
    it(`closes ${route} without card fields, payment requests, or success claims`, () => {
      let paymentRequests = 0;
      cy.intercept("**/payments/**", (req) => {
        paymentRequests++;
        req.reply({ statusCode: 503 });
      });
      cy.intercept("POST", "**/bookings/*/payment/*", (req) => {
        paymentRequests++;
        req.reply({ statusCode: 503 });
      });
      cy.visit(route);
      cy.get('[data-testid="payments-unavailable"]').should("be.visible");
      cy.contains("h1", "Online payments are not available");
      cy.get("main input").should("not.exist");
      cy.contains("Payment Successful").should("not.exist");
      cy.contains("a", "Explore vendors").should(
        "have.attr",
        "href",
        "/vendors",
      );
      cy.then(() => expect(paymentRequests).to.equal(0));
    });
  }
});
