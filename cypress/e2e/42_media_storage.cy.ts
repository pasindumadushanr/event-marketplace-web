export {};

const overview = {
  checkedAt: "2026-11-01T06:00:00Z",
  cacheSeconds: 300,
  uploadMode: "cloudinary",
  cloudinary: {
    status: "ok",
    level: "warning",
    message:
      "Storage, delivery and transformations share the reported credit allowance.",
    cloudName: "test-cloud",
    plan: "Free",
    storageBytes: 200000000,
    bandwidthBytes: 1000000000,
    transformations: 20,
    creditsUsed: 20,
    creditsAllowance: 25,
    creditsRemaining: 5,
    reportedAt: "2026-11-01T05:00:00Z",
  },
  r2: {
    status: "ok",
    level: "normal",
    message:
      "This bucket only. The free allowance is shared across the account.",
    bucket: "test-public-media",
    storageBytes: 2000000000,
    objects: 40,
    reportedAt: "2026-11-01T05:30:00Z",
    freeStorageReferenceBytes: 10000000000,
    bucketHeadroomBytes: 8000000000,
  },
};
function visit(role = "SUPER_ADMIN") {
  cy.visit("/admin/settings/media", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-admin");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "admin",
          email: "owner@example.com",
          firstName: "Owner",
          roleName: role,
        }),
      );
    },
  });
}
describe("Admin media capacity monitor", () => {
  it("shows separate provider budgets, warnings and the settings link", () => {
    cy.intercept("GET", "**/admin/media-usage", { body: overview }).as("usage");
    visit();
    cy.wait("@usage");
    cy.get("h1").should("contain", "Media storage");
    cy.contains("a", "Media Storage").should(
      "have.attr",
      "href",
      "/admin/settings/media",
    );
    cy.get("section")
      .filter(':contains("Cloudinary")')
      .should("contain", "5")
      .and("contain", "Plan more capacity");
    cy.get('[role="progressbar"][aria-label="Shared credits used"]').should(
      "have.attr",
      "aria-valuenow",
      "80",
    );
    cy.get("section")
      .filter(':contains("Cloudflare R2")')
      .should("contain", "2 GB")
      .and("contain", "8 GB")
      .and("contain", "40");
    cy.contains("Remaining credits are not remaining gigabytes.").should(
      "be.visible",
    );
    cy.contains("Other buckets share the account allowance.").should(
      "be.visible",
    );
    cy.screenshot("media-storage-desktop-preview", { capture: "viewport" });
  });
  it("shows missing configuration without fabricated free space", () => {
    cy.intercept("GET", "**/admin/media-usage", {
      body: {
        ...overview,
        r2: {
          ...overview.r2,
          status: "not_configured",
          storageBytes: null,
          bucketHeadroomBytes: null,
          message: "R2 monitoring is not connected.",
        },
      },
    });
    visit();
    cy.contains("Monitoring not connected").should("be.visible");
    cy.get("section")
      .filter(':contains("Cloudflare R2")')
      .should("not.contain", "8 GB")
      .and("not.contain", "0 B");
  });
  it("shows a confirmed zero-byte bucket correctly", () => {
    cy.intercept("GET", "**/admin/media-usage", {
      body: {
        ...overview,
        r2: {
          ...overview.r2,
          storageBytes: 0,
          objects: 0,
          bucketHeadroomBytes: 10000000000,
        },
      },
    });
    visit();
    cy.get("section")
      .filter(':contains("Cloudflare R2")')
      .should("contain", "0 B")
      .and("contain", "10 GB");
  });
  it("does not present old figures as current after a failed refresh and allows retry", () => {
    cy.intercept("GET", "**/admin/media-usage", { body: overview }).as("first");
    visit();
    cy.wait("@first");
    cy.intercept("GET", "**/admin/media-usage", {
      statusCode: 503,
      body: {},
    }).as("failed");
    cy.contains("button", "Refresh usage").click();
    cy.wait("@failed");
    cy.get('[role="alert"]').should("contain", "Could not load");
    cy.get('[role="progressbar"]').should("not.exist");
    cy.intercept("GET", "**/admin/media-usage", { body: overview }).as("retry");
    cy.contains("button", "Refresh usage").click();
    cy.wait("@retry");
    cy.get('[role="progressbar"]').should("have.length", 2);
  });
  it("works on mobile without horizontal overflow", () => {
    cy.viewport(390, 844);
    cy.intercept("GET", "**/admin/media-usage", { body: overview });
    visit();
    cy.contains("h2", "Cloudflare R2").should("be.visible");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });
  it("redirects a vendor away from the admin monitor", () => {
    visit("VENDOR");
    cy.location("pathname").should("eq", "/admin/login");
  });
});
