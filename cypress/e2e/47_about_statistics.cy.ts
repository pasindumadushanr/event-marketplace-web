export {};
const totals = {
  registeredVendors: 12,
  customerAccounts: 30,
  publishedVendors: 5,
  serviceCategories: 8,
};
describe("Real About statistics", () => {
  it("shows exact counts and refreshes when returning to the page", () => {
    let vendors = 12;
    cy.intercept("GET", "**/discovery/statistics", (req) =>
      req.reply({ body: { ...totals, registeredVendors: vendors } }),
    ).as("stats");
    cy.visit("/about");
    cy.wait("@stats");
    cy.get('[aria-label="Marketplace statistics"]').within(() => {
      cy.contains("Registered vendors").parent().should("contain.text", "12");
      cy.contains("Customer accounts").parent().should("contain.text", "30");
      cy.contains("Published vendor pages")
        .parent()
        .should("contain.text", "5");
      cy.contains("Happy Customers").should("not.exist");
      cy.contains("25,000+").should("not.exist");
    });
    cy.then(() => { vendors = 13; });
    cy.window().trigger("focus");
    cy.wait("@stats");
    cy.contains("Registered vendors").parent().should("contain.text", "13");
  });
  it("shows unavailable instead of fake or zero counts and retries", () => {
    cy.intercept("GET", "**/discovery/statistics", { statusCode: 503 }).as(
      "stats",
    );
    cy.visit("/about");
    cy.wait("@stats");
    cy.contains("Statistics are temporarily unavailable.").should("exist");
    cy.contains("Registered vendors").parent().should("contain.text", "—");
    cy.intercept("GET", "**/discovery/statistics", {
      body: { ...totals, registeredVendors: 0 },
    });
    cy.contains("button", "Try again").click();
    cy.contains("Registered vendors").parent().should("contain.text", "0");
  });
});
