import { previewSignature } from "../../src/components/vendor/setup-progress";

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

function visitVendor(
  path = "/vendor",
  status = "APPROVED",
  active = true,
  reviewed = false,
) {
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
    profileSettings: {
      ...business.profileSettings,
      ...(reviewed
        ? { setupReview: { signature: previewSignature(business, []) } }
        : {}),
    },
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
  stub("**/vendor/gallery", []);
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
  it("keeps the starting price card above the calendar while scrolling", () => {
    cy.viewport(1440, 900);
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: { ...business, startingPrice: 5222, packages: [] },
    });
    cy.visit("/business/vendor-test");
    cy.contains("p", "Starting Price").parent().parent().as("priceCard");
    cy.get("@priceCard").should("have.css", "position", "static");
    for (const offset of [500, 1000, 1500]) {
      cy.scrollTo(0, offset);
      cy.get("@priceCard").should(($card) => {
        const card = $card[0];
        const calendar = card.nextElementSibling;
        expect(calendar, "calendar follows the price card").not.to.be.null;
        expect(card.getBoundingClientRect().bottom).to.be.at.most(
          calendar!.getBoundingClientRect().top,
        );
      });
    }
  });
  it("renders saved visual edits after reload and on the customer-facing profile", () => {
    visitVendor("/vendor/preview");
    const updated = { ...business, name: "Published Photography Studio" };
    cy.intercept("PATCH", "**/vendor/business", { body: updated }).as(
      "savedName",
    );
    cy.get('button[aria-label="Edit Name, logo & cover"]').click();
    cy.contains("label", "Business name")
      .find("input")
      .clear()
      .type(updated.name);
    cy.contains("button", "Save changes").click();
    cy.wait("@savedName");
    cy.intercept("GET", "**/vendor/business", (req) => {
      if (req.headers.authorization) req.reply({ body: updated });
      else req.continue();
    });
    cy.reload();
    cy.get('[data-profile-section="hero"]').should("contain", updated.name);
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: { ...updated, packages: [] },
    });
    cy.visit("/business/vendor-test");
    cy.contains("h1", updated.name).should("be.visible");
    cy.contains("Edit My Business Page").should("not.exist");
  });
  it("edits the preview live, cancels safely, and saves section-scoped changes", () => {
    visitVendor("/vendor/preview");
    const writes: unknown[] = [];
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      writes.push(req.body);
      req.reply({ statusCode: 200, body: {} });
    }).as("visualSave");
    cy.get('button[aria-label="Edit Name, logo & cover"]').click();
    cy.contains("label", "Business name")
      .find("input")
      .clear()
      .type("New Studio Name");
    cy.get('[data-profile-section="hero"]').should(
      "contain",
      "New Studio Name",
    );
    cy.then(() => expect(writes).to.have.length(0));
    cy.on("window:confirm", () => true);
    cy.contains("button", "Cancel").click();
    cy.get('[data-profile-section="hero"]')
      .should("contain", "Sunrise Photography")
      .and("not.contain", "New Studio Name");
    cy.get('button[aria-label="Edit Name, logo & cover"]').click();
    cy.contains("label", "Business name")
      .find("input")
      .clear()
      .type("Saved Studio Name");
    cy.contains("button", "Save changes").click();
    cy.wait("@visualSave").its("request.body").should("deep.equal", {
      name: "Saved Studio Name",
      logo: business.logo,
      coverImage: business.coverImage,
    });
    cy.contains("Changes saved.").should("be.visible");
    cy.contains("button", "View as customer").click();
    cy.get('button[aria-label^="Edit "]').should("not.exist");
    cy.contains("button", "Request a Custom Quote").should("be.disabled");
    cy.contains("button", "Back to editing").click();
    cy.get('button[aria-label="Edit About your business"]').click();
    cy.get('aside[aria-label="Editing About your business"]').should(
      "be.visible",
    );
  });

  it("retains visual edits on a failed save and saves new services without changing profile visibility", () => {
    visitVendor("/vendor/preview");
    cy.intercept("PATCH", "**/vendor/business", { statusCode: 500, body: {} });
    cy.get('button[aria-label="Edit About your business"]').click();
    cy.contains("label", "Tell customers")
      .find("textarea")
      .clear()
      .type("A locally edited introduction.");
    cy.contains("button", "Save changes").click();
    cy.contains("Could not save these changes").should("be.visible");
    cy.contains("label", "Tell customers")
      .find("textarea")
      .should("have.value", "A locally edited introduction.");
    cy.on("window:confirm", () => true);
    cy.contains("button", "Cancel").click();
    cy.get('button[aria-label="Edit Services & prices"]').click();
    cy.contains("button", "Add a service").click();
    cy.contains("label", "Service name")
      .find("textarea")
      .type("Wedding coverage");
    cy.contains("label", "Price (LKR)")
      .find("input")
      .type("45000")
      .should("have.value", "45000");
    cy.intercept("POST", "**/vendor/packages", (req) => {
      expect(req.body.name).to.eq("Wedding coverage");
      expect(req.body.price).to.eq(45000);
      req.reply({ body: { ...req.body, id: "new-package" } });
    }).as("createService");
    cy.contains("button", "Save changes").click();
    cy.wait("@createService");
    cy.get('[data-profile-section="packages"]').should(
      "contain",
      "Wedding coverage",
    );
    cy.contains("button", "Hide My Page").should("be.enabled");
  });

  it("stages gallery uploads until Save and supports the phone editor", () => {
    cy.viewport(390, 844);
    visitVendor("/vendor/preview");
    let uploads = 0;
    cy.intercept("POST", "**/vendor/gallery/upload", (req) => {
      uploads++;
      req.reply({
        body: { id: "new-photo", url: business.logo, type: "IMAGE" },
      });
    }).as("galleryUpload");
    cy.get('button[aria-label="Edit Photos & videos"]').click();
    cy.get('input[type="file"]').selectFile(
      "public/images/brand/nakathata-logo.jpg",
    );
    cy.contains("Unsaved upload").should("be.visible");
    cy.then(() => expect(uploads).to.eq(0));
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("visual-profile-editor-mobile");
    cy.contains("button", "Save changes").click();
    cy.wait("@galleryUpload");
    cy.get('[data-profile-section="gallery"] img').should(
      "have.attr",
      "src",
      business.logo,
    );
  });
  it("shows a guided business overview and every section remains reachable", () => {
    visitVendor("/vendor/business");
    cy.contains("Your page setup checklist").should("be.visible");
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
    cy.contains("a", "Back to setup checklist").click();
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
    visitVendor("/vendor", "APPROVED", false, true);
    cy.contains("button", "Publish my page").should("be.enabled");
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
