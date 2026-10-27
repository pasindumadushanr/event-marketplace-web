import { DEFAULT_PLATFORM } from "../../src/lib/platform-settings";
import {
  whatsappEnquiryUrl,
  whatsappUrl,
  WHATSAPP_ENQUIRY,
} from "../../src/lib/whatsapp";
import {
  publicContactUrl,
  vendorWhatsappValue,
} from "../../src/lib/vendor-contact";
const original = {
  id: "vendor-test",
  name: "Wedding Studio",
  categoryId: "photo",
  category: { id: "photo", name: "Photography" },
  status: "ACTIVE",
  vendorStatus: "APPROVED",
  phone: "0711111111",
  email: "studio@example.com",
  city: "Colombo",
  address: "Colombo",
  website: "https://studio.lk",
  facebook: "https://facebook.com/studio",
  instagram: "https://instagram.com/studio",
  youtube: "https://youtube.com/@studio",
  profileSettings: {
    whatsapp: "0771234567",
    tiktok: "https://tiktok.com/@studio",
    policies: { bookingPolicy: "Contact first" },
  },
  packages: [],
  galleries: [],
  reviews: [],
  startingPrice: 0,
  rating: 0,
  reviewCount: 0,
  isVerified: false,
};
function auth(win: Window) {
  win.localStorage.setItem("accessToken", "test-only");
  win.localStorage.setItem(
    "user",
    JSON.stringify({ id: "v1", firstName: "Test", roleName: "VENDOR" }),
  );
}
describe("Direct vendor contact and social links", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/platform-settings", {
      body: { ...DEFAULT_PLATFORM, analytics: { googleAnalyticsId: "" } },
    });
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/business-categories", { body: [] });
    cy.intercept("GET", "**/vendor/business/onboarding/status", {
      body: { vendorStatus: "APPROVED", emailVerified: true },
    });
  });
  it("normalizes phone numbers, encodes enquiry text and blocks unsafe links", () => {
    expect(whatsappUrl("0771234567")).to.equal("https://wa.me/94771234567");
    const url = new URL(whatsappEnquiryUrl("+94 77 123 4567")!);
    expect(url.searchParams.get("text")).to.equal(WHATSAPP_ENQUIRY);
    expect(whatsappEnquiryUrl("javascript:1234567")).to.equal(null);
    expect(whatsappUrl("https://wa.me.evil.com/94771234567")).to.equal(null);
    expect(
      vendorWhatsappValue({
        whatsapp: "",
        contact: { whatsapp: "0771234567" },
      }),
    ).to.equal("");
    expect(publicContactUrl("instagram.com/studio", "instagram")).to.equal(
      "https://instagram.com/studio",
    );
    expect(publicContactUrl("javascript:alert(1)")).to.equal(null);
    expect(
      publicContactUrl("https://instagram.com.evil.com/studio", "instagram"),
    ).to.equal(null);
  });
  it("shows a WhatsApp action on search cards without nested links or login", () => {
    cy.intercept("GET", "**/discovery/search*", {
      body: {
        data: [
          { ...original, whatsapp: "94771234567" },
          {
            ...original,
            id: "no-contact",
            name: "No WhatsApp",
            whatsapp: null,
          },
        ],
        meta: { total: 2, page: 1, totalPages: 1 },
      },
    });
    cy.intercept("GET", "**/discovery/vendors/vendor-test", { body: original });
    cy.visit("/search");
    cy.get('[data-testid="vendor-card"]')
      .first()
      .within(() => {
        cy.contains("a", "Chat on WhatsApp")
          .should("have.attr", "href", whatsappEnquiryUrl("0771234567"))
          .and("have.attr", "target", "_blank");
        cy.get('a[href^="https://wa.me"]').parents("a").should("not.exist");
        cy.get('button[aria-label="Save to shortlist"]').click();
      });
    cy.location("pathname").should("eq", "/search");
    cy.get('[data-testid="vendor-card"]')
      .last()
      .find('a[href^="https://wa.me"]')
      .should("not.exist");
    cy.get('a[aria-label="View Wedding Studio"]').click();
    cy.location("pathname").should("eq", "/business/vendor-test");
  });
  it("keeps mobile WhatsApp visible and displays labeled public social buttons", () => {
    cy.intercept("GET", "**/discovery/vendors/vendor-test", { body: original });
    cy.viewport(390, 844);
    cy.visit("/business/vendor-test");
    cy.get('section[aria-label="Contact this vendor"]').within(() => {
      cy.contains("+94771234567").should("exist");
      cy.contains("a", "Chat on WhatsApp")
        .should("have.attr", "href", whatsappEnquiryUrl("0771234567"));
      cy.contains("Request a Quote").should("not.exist");
      cy.contains("Custom Quote").should("not.exist");
      cy.contains("Message Vendor").should("not.exist");
      cy.get('button[aria-label="Save to shortlist"]').should("exist");
    });
    cy.get('[aria-label="Quick contact"]').within(() => {
      cy.contains("a", "WhatsApp")
        .should("be.visible")
        .and("have.attr", "href", whatsappEnquiryUrl("0771234567"));
    });
    cy.get('[aria-label="Vendor contact and social media"]').within(() => {
      for (const [name, field] of [
        ["Facebook", "facebook"],
        ["Instagram", "instagram"],
        ["YouTube", "youtube"],
        ["TikTok", "tiktok"],
      ] as const) {
        cy.contains("a", name).should(
          "have.attr",
          "href",
          field === "tiktok"
            ? original.profileSettings.tiktok
            : original[field],
        );
      }
    });
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });
  it("lets vendors save and reload WhatsApp and all social links", () => {
    let saved: any = structuredClone(original);
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization ? req.reply({ body: saved }) : req.continue(),
    );
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      expect(req.body.profileSettings.whatsapp).to.equal("94761234567");
      expect(req.body.facebook).to.equal("https://facebook.com/newstudio");
      expect(req.body.instagram).to.equal("https://instagram.com/newstudio");
      saved = {
        ...saved,
        ...req.body,
        profileSettings: {
          ...saved.profileSettings,
          ...req.body.profileSettings,
        },
      };
      req.reply({ body: saved });
    }).as("save");
    cy.visit("/vendor/business/contact", { onBeforeLoad: auth });
    cy.get('input[name="whatsapp"]').clear().type("0761234567");
    cy.get('input[name="facebook"]').clear().type("facebook.com/newstudio");
    cy.get('input[name="instagram"]').clear().type("instagram.com/newstudio");
    cy.contains("a", "Test your WhatsApp link").should(
      "have.attr",
      "href",
      whatsappEnquiryUrl("0761234567"),
    );
    cy.contains("button", "Save contact & social links").click();
    cy.wait("@save");
    cy.reload();
    cy.get('input[name="whatsapp"]').should("have.value", "94761234567");
    cy.get('input[name="facebook"]').should(
      "have.value",
      "https://facebook.com/newstudio",
    );
    cy.then(() =>
      expect(saved.profileSettings.policies.bookingPolicy).to.equal(
        "Contact first",
      ),
    );
  });
  it("clears WhatsApp and social links without resurrecting an old nested number", () => {
    let saved: any = {
      ...structuredClone(original),
      profileSettings: {
        ...original.profileSettings,
        contact: { whatsapp: "0777654321" },
      },
    };
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization ? req.reply({ body: saved }) : req.continue(),
    );
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      expect(req.body.profileSettings.whatsapp).to.equal("");
      saved = {
        ...saved,
        ...req.body,
        profileSettings: {
          ...saved.profileSettings,
          ...req.body.profileSettings,
        },
      };
      req.reply({ body: saved });
    }).as("clear");
    cy.visit("/vendor/business/contact", { onBeforeLoad: auth });
    cy.get('input[name="whatsapp"]').clear();
    cy.get('input[name="instagram"]').clear();
    cy.contains("button", "Save contact & social links").click();
    cy.wait("@clear");
    cy.intercept("GET", "**/discovery/vendors/vendor-test", (req) =>
      req.reply({ body: saved }),
    );
    cy.visit("/business/vendor-test");
    cy.get('a[href^="https://wa.me"]').should("not.exist");
    cy.get('a[aria-label="Visit vendor on Instagram"]').should("not.exist");
  });
  it("rejects invalid values before saving and retains edits after an API failure", () => {
    let writes = 0;
    cy.intercept("GET", "**/vendor/business", (req) =>
      req.headers.authorization
        ? req.reply({ body: original })
        : req.continue(),
    );
    cy.intercept("PATCH", "**/vendor/business", (req) => {
      writes++;
      req.reply({ statusCode: 500, body: { message: "Please retry saving" } });
    }).as("failed");
    cy.visit("/vendor/business/contact", { onBeforeLoad: auth });
    cy.get('input[name="facebook"]').clear().type("javascript:alert(1)");
    cy.contains("button", "Save contact & social links").click();
    cy.contains("Enter a valid Facebook link").should("be.visible");
    cy.then(() => expect(writes).to.equal(0));
    cy.get('input[name="facebook"]').clear().type("facebook.com/newstudio");
    cy.contains("button", "Save contact & social links").click();
    cy.wait("@failed");
    cy.contains("Please retry saving").should("be.visible");
    cy.get('input[name="facebook"]').should(
      "have.value",
      "facebook.com/newstudio",
    );
  });
});
