import {
  serviceCardCopy,
  servicePriceLabel,
} from "../../src/lib/service-card-copy";

const base = {
  id: "vendor-test",
  name: "Wedding Studio",
  description: "Custom wedding services",
  status: "ACTIVE",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  phone: "0771234567",
  email: "vendor@example.com",
  address: "Colombo",
  city: "Colombo",
  profileSettings: { policies: { bookingPolicy: "Contact us to book" } },
};
function visitVendor(category: string, path = "/vendor/packages") {
  cy.intercept("GET", "**/vendor/business", (req) => {
    if (req.headers.authorization)
      req.reply({ body: { ...base, category: { name: category } } });
    else req.continue();
  });
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: { vendorStatus: "APPROVED", emailVerified: true },
  });
  cy.intercept("GET", "**/vendor/packages", (req) => {
    if (req.headers.authorization) req.reply({ body: [] });
    else req.continue();
  });
  cy.intercept("GET", "**/vendor/gallery", { body: [] });
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-only");
      win.localStorage.setItem(
        "user",
        JSON.stringify({ id: "v1", roleName: "VENDOR", firstName: "Test" }),
      );
    },
  });
}
describe("Business-aware service cards", () => {
  for (const [category, kind, title] of [
    ["Wedding Cars & Transport", "vehicle", "Wedding car with driver"],
    ["Wedding Cakes", "cake", "Three-tier floral wedding cake"],
    ["Wedding Photographers", "package", "Full-day wedding photography"],
  ]) {
    it(`saves a ${kind} with a photo, title, description and no fixed price`, () => {
      visitVendor(category);
      cy.contains("button", `Add a ${kind}`).first().click();
      cy.get('input[name="name"]')
        .should("have.attr", "placeholder", `e.g. ${title}`)
        .type(title);
      cy.get('textarea[name="description"]').type(
        "Available in Colombo. Contact us to customise.",
      );
      cy.get('input[name="image"]').type(base.logo);
      cy.get('input[name="price"]').should("have.value", "");
      cy.contains("Price on request").should("be.visible");
      let saved: any;
      cy.intercept("POST", "**/vendor/packages", (req) => {
        saved = { id: "listing", ...req.body };
        expect(saved).to.include({ name: title, image: base.logo, price: 0 });
        expect(saved.description).to.contain("Available in Colombo");
        req.reply({ body: saved });
      }).as("save");
      cy.intercept("GET", "**/vendor/packages", (req) => {
        if (req.headers.authorization)
          req.reply({ body: saved ? [saved] : [] });
        else req.continue();
      });
      cy.contains("button", `Save ${kind}`).first().click();
      cy.wait("@save");
      cy.contains('[data-slot="card-title"]', title).should("be.visible");
      cy.contains("Price on request").should("be.visible");
      cy.contains("LKR 0").should("not.exist");
    });
  }
  it("uses the same cake fields in visual editing and permits an omitted price", () => {
    visitVendor("Wedding Cakes", "/vendor/preview");
    cy.get('button[aria-label="Edit Services & prices"]').click();
    cy.contains("button", "Add a cake").click();
    cy.contains("label", "Title").find("textarea").type("Floral cake");
    cy.contains("label", "Description")
      .find("textarea")
      .type("Three tiers with fresh flowers");
    cy.contains("label", "Price (LKR) — optional")
      .find("input")
      .should("not.have.attr", "required");
    cy.intercept("POST", "**/vendor/packages", (req) => {
      expect(req.body).to.include({ name: "Floral cake", price: 0 });
      req.reply({ body: { id: "cake", ...req.body } });
    }).as("cake");
    cy.contains("button", "Save changes").click();
    cy.wait("@cake");
    cy.contains("h4", "Floral cake").should("be.visible");
    cy.contains("Price on request").should("be.visible");
  });
  it("validates a negative price and saves a fixed price without losing card details", () => {
    visitVendor("Wedding Cars");
    cy.contains("button", "Add a vehicle").first().click();
    cy.get('input[name="name"]').type("Classic wedding car");
    cy.get('textarea[name="description"]').type("Driver and fuel included");
    cy.get('input[name="price"]').type("-1");
    cy.contains("button", "Save vehicle").first().click();
    cy.contains("Enter a price of zero or more").should("be.visible");
    cy.get('input[name="price"]').clear().type("25000");
    cy.intercept("POST", "**/vendor/packages", (req) => {
      expect(req.body).to.include({
        name: "Classic wedding car",
        description: "Driver and fuel included",
        price: 25000,
      });
      req.reply({ body: { id: "car", ...req.body } });
    }).as("fixedPrice");
    cy.contains("LKR 25,000").should("be.visible");
    cy.contains("button", "Save vehicle").first().click();
    cy.wait("@fixedPrice");
  });
  it("routes quote-only public cards to messaging, never checkout", () => {
    cy.intercept("GET", "**/chat/conversations", { body: [] });
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: {
        ...base,
        category: { name: "Wedding Cakes" },
        packages: [
          {
            id: "cake",
            name: "Floral cake",
            description: "Custom wedding cake",
            image: base.logo,
            price: 0,
            features: [],
            status: "ACTIVE",
          },
        ],
      },
    });
    cy.intercept("POST", "**/chat/conversations", {
      body: { id: "conversation" },
    }).as("chat");
    let bookingRequests = 0;
    cy.intercept("POST", "**/bookings", (req) => {
      bookingRequests++;
      req.reply({ statusCode: 400 });
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
    cy.contains("Cakes & Available Options").should("be.visible");
    cy.contains("button", "Enquire about pricing").click();
    cy.wait("@chat").its("request.body.businessId").should("eq", "vendor-test");
    cy.location("pathname").should("eq", "/account/messages");
    cy.then(() => expect(bookingRequests).to.equal(0));
  });
  it("distinguishes cards from cars and preserves fixed-price display", () => {
    expect(serviceCardCopy("Wedding Invitation Cards").kind).to.equal(
      "service",
    );
    expect(
      serviceCardCopy({ category: { slug: "vintage-classic-cars" } }).kind,
    ).to.equal("vehicle");
    expect(servicePriceLabel(25000)).to.equal("LKR 25,000");
    expect(servicePriceLabel(0)).to.equal("Price on request");
  });
});
