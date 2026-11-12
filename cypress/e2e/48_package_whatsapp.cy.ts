export {};
const business = {
  id: "vendor-test",
  name: "Wedding Studio",
  status: "ACTIVE",
  vendorStatus: "APPROVED",
  description: "Wedding photography",
  city: "Colombo",
  address: "Colombo",
  email: "test@example.com",
  phone: "0771234567",
  category: { id: "photo", name: "Photographers" },
  logo: "/images/brand/nakathata-logo.jpg",
  coverImage: "/images/brand/nakathata-logo.jpg",
  profileSettings: {
    whatsapp: "0771234567",
    policies: { bookingPolicy: "Contact us" },
  },
  packages: [
    {
      id: "package-one",
      name: "Photo & Video",
      description: "Full wedding coverage",
      price: 0,
      status: "ACTIVE",
      features: [],
    },
  ],
  galleries: [],
  reviews: [],
};
describe("Package WhatsApp contact", () => {
  it("puts packages immediately below contact on mobile and includes the selected package in WhatsApp", () => {
    cy.viewport(390, 844);
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: business,
    }).as("profile");
    cy.visit("/business/vendor-test");
    cy.wait("@profile");
    cy.get('[aria-label="Services and packages"]').within(() => {
      cy.get('a[aria-label="Ask about Photo & Video on WhatsApp"]')
        .should("have.attr", "target", "_blank")
        .invoke("attr", "href")
        .then((href) => {
          const url = new URL(href!);
          expect(url.origin + url.pathname).to.eq("https://wa.me/94771234567");
          expect(url.searchParams.get("text"))
            .to.contain("Nakathata.lk")
            .and.contain('"Photo & Video"')
            .and.contain("Wedding Studio");
        });
      cy.contains("Enquire about pricing").should("not.exist");
    });
    cy.get('[aria-label="Vendor contact and social media"]').then(
      ($contact) => {
        cy.get('[aria-label="Services and packages"]').then(($packages) => {
          expect($packages[0].getBoundingClientRect().top).to.be.at.least(
            $contact[0].getBoundingClientRect().bottom,
          );
          cy.contains("h3", "About Wedding Studio").then(($about) => {
            expect($about[0].getBoundingClientRect().top).to.be.at.least(
              $packages[0].getBoundingClientRect().bottom,
            );
          });
        });
      },
    );
  });
  it("does not use the phone number as WhatsApp when WhatsApp is missing", () => {
    cy.intercept("GET", "**/discovery/vendors/vendor-test", {
      body: {
        ...business,
        profileSettings: { ...business.profileSettings, whatsapp: "" },
      },
    }).as("profile");
    cy.visit("/business/vendor-test");
    cy.wait("@profile");
    cy.get('[aria-label="Services and packages"]').within(() => {
      cy.contains("button", "WhatsApp not added yet").should("be.disabled");
      cy.get('a[href*="wa.me"]').should("not.exist");
    });
  });
});
