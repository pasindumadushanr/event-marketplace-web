const business = {
  id: "vendor-test",
  name: "Sunrise Photography",
  description: "Wedding photography in Colombo",
  status: "ACTIVE",
  phone: "0771234567",
  email: "test@example.com",
  address: "Colombo",
  city: "Colombo",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  category: { id: "photo", name: "Photography" },
  galleries: [],
  profileSettings: {
    policies: { bookingPolicy: "Contact us before booking" },
    hours: [],
  },
};

function visitVendor(path = "/vendor", status = "APPROVED", active = true) {
  const stub = (url: string, body: unknown) =>
    cy.intercept("GET", url, (req) => {
      if (req.headers.authorization) req.reply({ body });
      else req.continue();
    });
  stub("**/vendor/business/onboarding/status", {
    emailVerified: true,
    vendorStatus: status,
  });
  stub("**/vendor/business", {
    ...business,
    status: active ? "ACTIVE" : "INACTIVE",
  });
  stub("**/bookings/vendor", [
    {
      id: "b1",
      status: "PENDING",
      date: "2027-10-10",
      package: { name: "Wedding coverage" },
    },
  ]);
  stub("**/chat/conversations?mode=vendor", [
    {
      id: "c1",
      customerId: "customer",
      customer: { firstName: "Test", lastName: "Customer" },
      messages: [{ senderId: "customer", content: "Is this date available?" }],
    },
  ]);
  stub("**/vendor/packages", []);
  stub("**/vendor/business/content", []);
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "local-test-only");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "v1",
          firstName: "Test",
          lastName: "Vendor",
          roleName: "VENDOR",
        }),
      );
    },
  });
}

describe("Simplified vendor workspace", () => {
  it("shows a guided business overview and every section remains reachable", () => {
    visitVendor("/vendor/business");
    cy.contains("4 of 4 essentials added").should("be.visible");
    cy.contains("a", "Policies & questions").click();
    cy.get("#business-section").find("option").should("have.length", 12);
    cy.contains("h1", "Policies & common questions").should("be.visible");
    cy.screenshot("business-policy-editor-desktop");
  });

  it("previews policy edits and saves only the edited settings", () => {
    visitVendor("/vendor/business/policies");
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      expect(req.body.profileSettings.policies.bookingPolicy).to.equal(
        "Contact our team to reserve your date.",
      );
      expect(req.body.profileSettings).not.to.have.property("hours");
      req.reply({ statusCode: 200, body: {} });
    }).as("savePolicies");
    cy.get("#bookingPolicy")
      .clear()
      .type("Contact our team to reserve your date.");
    cy.contains("You have unsaved changes").should("be.visible");
    cy.contains("button", "Customer preview").click();
    cy.get("form aside").should(
      "contain",
      "Contact our team to reserve your date.",
    );
    cy.contains("button", "Save changes").click();
    cy.wait("@savePolicies");
    cy.contains("All changes saved").should("be.visible");
    cy.contains("button", "Save changes").should("be.disabled");
  });

  it("retains edits on save failure and prevents incomplete questions", () => {
    visitVendor("/vendor/business/policies");
    cy.intercept("PATCH", "**/vendor/business", { statusCode: 500, body: {} });
    cy.get("#bookingPolicy").type(" More details.");
    cy.contains("button", "Save changes").click();
    cy.contains("Your changes weren’t saved").should("be.visible");
    cy.get("#bookingPolicy").should("contain.value", "More details.");
    cy.contains("button", "Common questions").click();
    cy.contains("button", "Add question").click();
    cy.get("#question-0").type("Do you travel?");
    cy.contains("button", "Save changes").click();
    cy.contains("Add both a question and an answer").should("be.visible");
    cy.get("#answer-0").type("Please contact us with your event location.");
    cy.on("window:confirm", () => false);
    cy.contains("a", "All business sections").click();
    cy.location("pathname").should("eq", "/vendor/business/policies");
  });

  it("keeps policy editing and question removal accessible on phones", () => {
    cy.viewport(390, 844);
    visitVendor("/vendor/business/policies");
    cy.contains("h1", "Policies & common questions").should("be.visible");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.contains("button", "Common questions").click();
    cy.contains("button", "Add question").click();
    cy.get('button[aria-label="Remove question 1"]').should("be.visible");
    cy.screenshot("business-policy-editor-mobile");
    cy.get('button[aria-label="Remove question 1"]').click();
    cy.contains("Add your first question").should("be.visible");
  });
  it("shows daily actions and only highlights the current navigation item", () => {
    visitVendor();
    cy.contains("Needs your attention").should("be.visible");
    cy.screenshot("vendor-home-desktop");
    cy.contains("a", "New booking requests").should("contain", "1");
    cy.contains("a", "Conversations to reply to").should("contain", "1");
    cy.get('aside a[aria-current="page"]')
      .should("have.length", 1)
      .and("contain", "Home");
    cy.get('aside a[href="/vendor/business"]').click();
    cy.get('aside a[aria-current="page"]')
      .should("have.length", 1)
      .and("contain", "My Business Page");
    cy.contains("Choose what you want to update").should("be.visible");
    cy.screenshot("vendor-business-desktop");
  });

  it("does not require SEO or seven days of hours to enable publishing", () => {
    visitVendor("/vendor", "APPROVED", false);
    cy.contains("button", "Make My Page Visible").should("be.enabled");
    cy.contains("SEO Optimization").should("not.exist");
  });

  it("keeps pending vendors in application guidance", () => {
    visitVendor("/vendor", "PENDING");
    cy.contains("Application Under Review").should("be.visible");
    cy.contains("aside a", "Bookings").should("not.exist");
    cy.contains("Needs your attention").should("not.exist");
  });

  it("uses photography examples instead of car-rental defaults", () => {
    visitVendor("/vendor/packages");
    cy.contains("button", "Add Service").click();
    cy.get('input[name="name"]').should(
      "have.attr",
      "placeholder",
      "e.g. Full-day wedding photography",
    );
    cy.contains("Full-day coverage").should("be.visible");
    cy.contains("Mercedes-Benz Luxury Wedding Car").should("not.exist");
  });

  it("never substitutes a sample vendor in preview", () => {
    visitVendor("/vendor/preview");
    cy.contains("h1", "Sunrise Photography").should("be.visible");
    cy.contains("The Grand Ballroom").should("not.exist");
    cy.contains("Customer booking actions are disabled").should("be.visible");
  });

  it("fits the phone screen and opens labelled navigation", () => {
    cy.viewport(390, 844);
    visitVendor();
    cy.contains("Needs your attention").should("be.visible");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("vendor-home-mobile");
    cy.get('button[aria-label="Open navigation"]').click();
    cy.contains("aside a", "Messages").should("be.visible").click();
    cy.contains("Test Customer").should("be.visible");
  });
});
