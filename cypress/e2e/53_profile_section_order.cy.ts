export {};

const profile = {
  id: "vendor-test",
  name: "Wedding Studio",
  status: "ACTIVE",
  vendorStatus: "APPROVED",
  description: "Wedding photography",
  categoryId: "photo",
  category: { id: "photo", name: "Photographers" },
  phone: "0771234567",
  email: "test@example.com",
  city: "Colombo",
  address: "10 Main Street",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  profileSettings: {
    whatsapp: "0771234567",
    faqs: [{ question: "How do we book?", answer: "Contact us." }],
    features: [{ groupName: "Services", features: ["Travel available"] }],
    policies: {
      bookingPolicy: "Contact us",
      cancellationPolicy: "Discuss with us",
    },
  },
  galleries: [
    { id: "g1", type: "IMAGE", url: "/images/brand/nakathata-logo.jpg" },
  ],
  packages: [
    {
      id: "p1",
      name: "Wedding package",
      price: 1000,
      features: [],
      status: "ACTIVE",
    },
  ],
  reviews: [],
};
const order = [
  "contact",
  "about",
  "gallery",
  "packages",
  "reviews",
  "location",
  "features",
  "availability",
  "hours",
  "faq",
  "policies",
];
function assertMobileOrder() {
  cy.get('[data-profile-section="policies"]').should("exist");
  cy.get("[data-profile-section]").then((elements) => {
    const positions = order.map((name) => {
      const element = [...elements].find(
        (element) => element.getAttribute("data-profile-section") === name,
      )!;
      expect(element, name).to.exist;
      return {
        name,
        top: element.getBoundingClientRect().top,
        bottom: element.getBoundingClientRect().bottom,
      };
    });
    for (let i = 1; i < positions.length; i++)
      expect(
        positions[i].top,
        `${positions[i - 1].name} before ${positions[i].name}`,
      ).to.be.at.least(positions[i - 1].bottom - 1);
  });
}
function assertEvenMobileSpacing() {
  cy.get('[data-profile-section="policies"]').should("exist");
  cy.get("[data-profile-section]").should((elements) => {
    const cards = [...elements]
      .filter((element) => element.getBoundingClientRect().height > 0)
      .map((element) => ({
        name: element.getAttribute("data-profile-section"),
        rect: element.getBoundingClientRect(),
      }))
      .sort((a, b) => a.rect.top - b.rect.top);
    for (let i = 1; i < cards.length; i++) {
      expect(
        cards[i].rect.top - cards[i - 1].rect.bottom,
        `gap between ${cards[i - 1].name} and ${cards[i].name}`,
      ).to.be.closeTo(20, 1);
    }
  });
}
function openEditor() {
  cy.intercept("GET", "**/vendor/business/onboarding/status", {
    body: { vendorStatus: "APPROVED", emailVerified: true },
  });
  cy.intercept("GET", "**/vendor/business", { body: profile });
  cy.intercept("GET", "**/vendor/packages", { body: profile.packages });
  cy.intercept("GET", "**/vendor/gallery", { body: profile.galleries });
  cy.visit("/vendor", {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-only");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "vendor-test",
          firstName: "Test",
          roleName: "VENDOR",
        }),
      );
    },
  });
}
describe("Mobile vendor profile section order", () => {
  it("uses the agreed order on the public mobile profile", () => {
    cy.viewport(390, 844);
    cy.intercept("GET", "**/discovery/vendors/vendor-test", { body: profile });
    cy.visit("/business/vendor-test");
    assertMobileOrder();
    assertEvenMobileSpacing();
    cy.get('[aria-label="Quick contact"] a')
      .should("have.attr", "href")
      .and("include", "wa.me/94771234567");
  });
  it("uses the same mobile order in the visual editor and customer preview", () => {
    cy.viewport(375, 812);
    openEditor();
    assertMobileOrder();
    assertEvenMobileSpacing();
    cy.contains("button", "View as customer").click();
    assertMobileOrder();
    assertEvenMobileSpacing();
    cy.get('[aria-label="Edit Name, logo & cover"]').should("not.exist");
  });
  it("keeps editing controls for missing optional sections but hides them from customers", () => {
    cy.viewport(375, 812);
    openEditor();
    const empty = {
      ...profile,
      galleries: [],
      profileSettings: { ...profile.profileSettings, faqs: [], features: [] },
    };
    cy.intercept("GET", "**/vendor/business", { body: empty });
    cy.intercept("GET", "**/vendor/gallery", { body: [] });
    cy.reload();
    cy.get('[data-profile-section="gallery"] button').should("be.visible");
    cy.intercept("GET", "**/discovery/vendors/vendor-test", { body: empty });
    cy.visit("/business/vendor-test");
    cy.get('[data-profile-section="gallery"]').should("not.be.visible");
    cy.get('[data-profile-section="faq"]').should("not.be.visible");
    cy.get('[data-profile-section="features"]').should("not.be.visible");
    assertEvenMobileSpacing();
  });
  for (const width of [320, 430, 768]) {
    it(`keeps equal section gaps at ${width}px in the editor and preview`, () => {
      cy.viewport(width, 900);
      openEditor();
      assertEvenMobileSpacing();
      cy.contains("button", "View as customer").click();
      assertEvenMobileSpacing();
    });
  }
  it("preserves the desktop columns and their original order", () => {
    cy.viewport(1440, 900);
    cy.intercept("GET", "**/discovery/vendors/vendor-test", { body: profile });
    cy.visit("/business/vendor-test");
    cy.get('[data-profile-section="about"]').then(($about) => {
      cy.get('[data-profile-section="contact"]').then(($contact) => {
        expect($about[0].getBoundingClientRect().right).to.be.at.most(
          $contact[0].getBoundingClientRect().left,
        );
      });
    });
    cy.get('[data-profile-section="features"]').then(($features) => {
      cy.get('[data-profile-section="gallery"]').then(($gallery) => {
        expect($features[0].getBoundingClientRect().bottom).to.be.at.most(
          $gallery[0].getBoundingClientRect().top,
        );
      });
    });
  });
});
