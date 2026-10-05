import { mapBusinessData } from "../../src/lib/map-business-profile";
import { whatsappUrl } from "../../src/lib/whatsapp";
const profile = {
  id: "vendor-test",
  name: "Sunrise Photography",
  isVerified: true,
  status: "ACTIVE",
  vendorStatus: "APPROVED",
  phone: "0771234567",
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  category: { name: "Wedding Photographers" },
  verification: { isEmailVerified: true },
  profileSettings: { whatsapp: "0771234567", bookingMethod: "REQUEST_QUOTE" },
  packages: [
    {
      id: "package",
      name: "Full-day photography",
      description:
        "Beautiful wedding photographs with an album and an easy-to-understand service description.",
      price: 0,
      features: ["Wedding album"],
      image: "/images/brand/nakathata-logo.jpg",
    },
  ],
  galleries: [],
  rating: 4,
  reviewCount: 2,
  reviews: [
    {
      id: "r1",
      customer: { firstName: "Nimali" },
      rating: 5,
      comment: "Lovely photographs",
      isVerifiedCustomer: true,
    },
    {
      id: "r2",
      customer: { firstName: "Kamal" },
      rating: 3,
      comment: "Helpful communication",
      isVerifiedCustomer: false,
    },
  ],
};
function auth(win: Window, vendor = false) {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem(
    "user",
    JSON.stringify({
      id: vendor ? "v1" : "c1",
      firstName: "Test",
      roleName: vendor ? "VENDOR" : "CUSTOMER",
    }),
  );
}
function customer(data = profile) {
  cy.intercept("GET", "**/discovery/vendors/vendor-test", { body: data });
  cy.intercept("GET", "**/customer/account/favorites", { body: [] });
  cy.visit("/business/vendor-test", { onBeforeLoad: (win) => auth(win) });
}
describe("Honest trust labels and phone-first profiles", () => {
  it("does not infer verification or WhatsApp from a phone number or legacy flags", () => {
    const result = mapBusinessData({
      id: "b",
      isVerified: true,
      phone: "0771234567",
      profileSettings: { verification: { isPhoneVerified: true } },
    });
    if (!result) throw new Error('Expected a mapped profile');
    expect(result.verification.isEmailVerified).to.equal(false);
    expect(result.verification.isPhoneVerified).to.equal(false);
    expect(result.isVerified).to.equal(false);
    expect(result.contact.whatsapp).to.equal("");
    expect(whatsappUrl("0771234567")).to.equal("https://wa.me/94771234567");
    expect(whatsappUrl("+94 77 123 4567")).to.equal(
      "https://wa.me/94771234567",
    );
    expect(whatsappUrl("https://wa.me/94771234567")).to.equal(
      "https://wa.me/94771234567",
    );
    expect(whatsappUrl("javascript:123456789")).to.equal(null);
  });
  it("explains genuine checks and review labels with easy phone contact and readable services", () => {
    cy.viewport(390, 844);
    customer();
    cy.contains("Vendor account email confirmed").should("exist");
    cy.contains(
      "Identity, business registration, and phone ownership have not been verified",
    ).should("exist");
    cy.contains("Verified customer · completed booking").should("exist");
    cy.contains("Customer review · booking not verified").should("exist");
    cy.contains("Based on 2 customer reviews").should("exist");
    cy.get('div[aria-label="Quick contact"]').within(() => {
      cy.contains("a", "WhatsApp").should(
        "have.attr",
        "href",
        "https://wa.me/94771234567",
      );
      cy.contains("button", "Message").should("be.visible").click();
    });
    cy.contains("label", "Event date").should("be.visible");
    cy.get('div[aria-label="Quick contact"]').should("not.exist");
    cy.contains("button", "Cancel").click();
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('div[aria-label="Quick contact"]').should('be.visible');
    cy.contains("p", "Beautiful wedding photographs").should(
      "have.css",
      "font-size",
      "14px",
    );
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.contains("Full-day photography").scrollIntoView();
    cy.viewport(390, 624);
    cy.screenshot("phone-service-and-contact", { capture: "viewport" });
    cy.get("#reviews").scrollIntoView();
    cy.screenshot("phone-review-labels", { capture: "viewport" });
  });
  it("does not show unconfirmed email checks or invalid WhatsApp numbers", () => {
    cy.viewport(390, 844);
    customer({
      ...profile,
      verification: { isEmailVerified: false },
      profileSettings: { ...profile.profileSettings, whatsapp: "not a phone" },
    });
    cy.contains("Vendor account email confirmed").should("not.exist");
    cy.get('div[aria-label="Quick contact"] a').should("not.exist");
    cy.get('div[aria-label="Quick contact"] button').should("be.visible");
  });
  it("supports camera uploads, reports mixed failures honestly, and shows touch-friendly photo controls", () => {
    cy.viewport(390, 844);
    let items: any[] = [];
    let calls = 0;
    cy.intercept("GET", "**/vendor/business", { body: profile });
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "APPROVED", emailVerified: true },
    });
    cy.intercept("GET", "**/customer/account/favorites", { body: [] });
    cy.intercept("GET", "**/vendor/gallery", (req) =>
      req.headers.authorization ? req.reply({ body: items }) : req.continue(),
    );
    cy.intercept("POST", "**/vendor/gallery/upload", (req) => {
      calls++;
      if (calls === 2) {
        req.reply({ statusCode: 503, body: {} });
        return;
      }
      const item = {
        id: "photo",
        url: "https://example.com/photo.jpg",
        type: "IMAGE",
        isCover: false,
        sortOrder: 0,
      };
      items = [item];
      req.reply({ body: item });
    }).as("upload");
    cy.visit("/vendor/gallery", { onBeforeLoad: (win) => auth(win, true) });
    cy.get('input[aria-label="Take gallery photo"]').should(
      "have.attr",
      "capture",
      "environment",
    );
    cy.contains("button", "Take a photo").should("be.visible");
    cy.get('input[aria-label="Choose gallery files"]').selectFile(
      [
        {
          contents: Cypress.Buffer.from("photo"),
          fileName: "good.jpg",
          mimeType: "image/jpeg",
        },
        {
          contents: Cypress.Buffer.from("photo"),
          fileName: "retry.jpg",
          mimeType: "image/jpeg",
        },
        {
          contents: Cypress.Buffer.from("photo"),
          fileName: "unsupported.heic",
          mimeType: "image/heic",
        },
      ],
      { force: true },
    );
    cy.wait("@upload");
    cy.wait("@upload");
    cy.contains("1 of 3 files uploaded · 2 need attention").should(
      "be.visible",
    );
    cy.contains("retry.jpg: upload failed").should("be.visible");
    cy.contains("unsupported.heic: choose a JPG").should("be.visible");
    cy.get('img[alt="Uploaded gallery photo"]').should(
      "have.attr",
      "src",
      "https://example.com/photo.jpg",
    );
    cy.contains("button", "Set Cover").should("be.visible");
    cy.get('button[aria-label="Delete photo"]').should("be.visible");
    cy.get('input[aria-label="Take gallery photo"]').selectFile(
      {
        contents: Cypress.Buffer.from("photo"),
        fileName: "retry.jpg",
        mimeType: "image/jpeg",
      },
      { force: true },
    );
    cy.wait("@upload");
    cy.contains("1 of 1 files uploaded.").should("be.visible");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("phone-gallery-upload", { capture: "fullPage" });
  });
  it("publishes clear limitations instead of unsupported guarantees", () => {
    cy.visit("/trust");
    cy.contains("What “Verified” means").should("be.visible");
    cy.contains(
      "We do not award a general Verified business badge without recorded checks",
    ).should("be.visible");
    cy.contains("Zero Risk").should("not.exist");
    cy.contains("100% Refund Guarantee").should("not.exist");
  });
});
