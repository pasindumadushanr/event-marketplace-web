export {};

const vendor = {
  id: "vendor-test",
  firstName: "Test",
  lastName: "Vendor",
  email: "vendor@example.com",
  status: "ACTIVE",
  role: { name: "VENDOR" },
  createdAt: "2026-10-01T12:00:00Z",
  vendorSubscriptions: [],
};

function visitVendors(roleName = "ADMIN") {
  cy.intercept("GET", "**/users?roles=VENDOR", { body: [vendor] });
  cy.intercept("GET", "**/subscriptions/plans", { body: [] });
  cy.visit("/admin/users/vendors", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-admin");
      win.localStorage.setItem(
        "user",
        JSON.stringify({ id: "admin", firstName: "Admin", roleName }),
      );
    },
  });
  cy.contains("td", vendor.email).should("be.visible");
}

describe("Vendor action menu", () => {
  it("opens the contact form and sends a message for the selected vendor", () => {
    cy.intercept("POST", "**/users/vendor-test/contact", {
      body: { success: true },
    }).as("contact");
    visitVendors();
    cy.get('button[aria-label="Contact Test Vendor"]').click();
    cy.get('[role="dialog"]')
      .should("be.visible")
      .within(() => {
        cy.contains(vendor.email).should("be.visible");
        cy.get("input").type("Application details");
        cy.get("textarea").type("Please update your business details.");
        cy.contains("button", "Send Message").click();
      });
    cy.wait("@contact").its("request.body").should("deep.equal", {
      subject: "Application details",
      message: "Please update your business details.",
      method: "EMAIL",
    });
    cy.get('[role="dialog"]').should("not.exist");
    cy.get('button[aria-label="Contact Test Vendor"]').click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("button", "Cancel").click();
  });
  it("explains restricted actions to regular admins", () => {
    visitVendors();
    cy.contains(
      "Suspending or reactivating accounts requires a Super Admin.",
    ).should("be.visible");
    cy.get('button[aria-label^="More actions"]').should("not.exist");
  });
  it("lets Super Admins suspend and reactivate vendors", () => {
    let status = "ACTIVE";
    cy.intercept("PATCH", "**/users/vendor-test/status", (req) => {
      status = req.body.status;
      req.reply({ body: { ...vendor, status } });
    }).as("status");
    visitVendors("SUPER_ADMIN");
    cy.intercept("GET", "**/users?roles=VENDOR", (req) =>
      req.reply({ body: [{ ...vendor, status }] }),
    );
    cy.get('button[aria-label^="More actions"]').click();
    cy.contains('[role="menuitem"]', "Suspend User").click();
    cy.wait("@status").its("request.body.status").should("equal", "SUSPENDED");
    cy.contains("td", "SUSPENDED").should("be.visible");
    cy.get('button[aria-label^="More actions"]').click();
    cy.contains('[role="menuitem"]', "Activate User").click();
    cy.wait("@status").its("request.body.status").should("equal", "ACTIVE");
    cy.contains("td", "ACTIVE").should("be.visible");
  });
  it("opens the subscription submenu and reports status errors", () => {
    visitVendors("SUPER_ADMIN");
    cy.intercept("PATCH", "**/users/vendor-test/status", {
      statusCode: 403,
      body: { message: "You cannot suspend your own account." },
    });
    cy.get('button[aria-label^="More actions"]').click();
    cy.contains('[role="menuitem"]', "Grant Free Sub").click();
    cy.contains('[role="menuitem"]', "No plans available").should("be.visible");
    cy.get("body").type("{esc}");
    cy.contains('[role="menuitem"]', "Suspend User").click();
    cy.contains("You cannot suspend your own account.").should("be.visible");
    cy.contains("td", "ACTIVE").should("be.visible");
  });
  it("supports contact on small screens", () => {
    cy.viewport(390, 844);
    visitVendors();
    cy.get('[data-slot="table-container"]').scrollTo("right");
    cy.get('button[aria-label="Contact Test Vendor"]').click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.contains("button", "Cancel").click();
    cy.get('[role="dialog"]').should("not.exist");
  });
});
