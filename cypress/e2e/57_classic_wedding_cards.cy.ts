const designs = [
  ["W07", "Autumn Petals"],
  ["W08", "Emerald Lotus"],
  ["W09", "Olive & Gold"],
] as const;

describe("Classic wedding invitations", () => {
  for (const width of [320, 740, 1280]) {
    it(`keeps W07 names and family lines inside the ivory panel at ${width}px`, () => {
      cy.viewport(width, 850);
      cy.visit("/invitation-templates/w07");
      cy.document().then((doc) => doc.fonts.ready);
      cy.get('[data-classic-wedding="W07"] article[aria-label="Wedding invitation"]').should(($card) => {
        const card = $card[0];
        const { left, width } = card.getBoundingClientRect();
        const text = card.querySelectorAll("h1 bdi, h1 small, time span");
        expect(text.length).to.be.greaterThan(5);
        for (const line of text) {
          const range = card.ownerDocument.createRange();
          range.selectNodeContents(line);
          for (const rect of Array.from(range.getClientRects())) {
            expect(rect.left).to.be.at.least(left + width * .215);
            expect(rect.right).to.be.at.most(left + width * .785);
          }
        }
      });
      if (width === 740) cy.screenshot("w07-inset-desktop", { capture: "viewport" });
    });
  }
  for (const [id] of designs) {
    it(`opens ${id} directly on a narrow phone and never sends a demo RSVP`, () => {
      cy.viewport(320, 700);
      cy.visit(`/invitation-templates/${id.toLowerCase()}`);
      cy.get(`[data-classic-wedding="${id}"] h1`).should("contain.text", "Amaya Perera");
      cy.get(`img[src$="/${id.toLowerCase()}/card.webp"]`).should("have.prop", "naturalWidth").and("be.gt", 0);
      cy.contains("button", "Open invitation").should("not.exist");
      cy.contains("The Garden Pavilion").should("be.visible");
      cy.document().its("documentElement.scrollWidth").should("be.lte", 320);
      cy.screenshot(`${id.toLowerCase()}-mobile`, { capture: "viewport" });
      cy.contains("a", "Get directions").should("have.attr", "href").and("include", "Bentota");
      cy.contains("button", "Try RSVP").click();
      cy.get('[role="status"]').should("contain.text", "does not send a message");
      cy.get('a[href*="wa.me"]').should("not.exist");
    });
  }
  it("lists all three designs in the public catalogue", () => {
    cy.intercept("GET", "**/public/invitations/catalogue", { body: { orderPhone: "0771234567" } });
    cy.visit("/invitation-templates");
    for (const [id, name] of designs) {
      cy.contains("h2", name).closest("article").within(() => {
        cy.contains("a", "View demo").should("have.attr", "href", `/invitation-templates/${id.toLowerCase()}`);
        cy.contains("Optional family names, verse & photos").should("exist");
        cy.contains("LKR 750").should("be.visible");
        cy.contains("a", "Choose on WhatsApp").should(($link) => {
          const url = new URL($link.attr("href")!);
          expect(url.searchParams.get("text")).to.include(`${id} — ${name}, LKR 750`);
        });
      });
    }
  });
  it("saves a family line and verse in Studio and renders the saved text in preview", () => {
    cy.intercept("GET", "**/invitation-studio/session", { body: { role: "ADMIN" } });
    cy.intercept("GET", "**/invitation-studio/invitations", { body: [] });
    cy.intercept("GET", "**/invitation-studio/settings", { body: { orderPhone: "" } });
    cy.intercept("POST", "**/invitation-studio/invitations", (req) => {
      expect(req.body.templateId).to.equal("W09");
      expect(req.body.draft).to.include({ familyOne: "The Perera family", weddingVerse: "Two hearts, one beginning.", couplePhoto: "" });
      req.reply({ body: { ...req.body, id: "classic-test", status: "DRAFT", revision: 1 } });
    }).as("saveClassic");
    cy.visit("/invitation-studio", {
      onBeforeLoad(win) { win.sessionStorage.setItem("invitationStudioToken", "test"); },
    });
    cy.contains("button", "Create invitation").click();
    for (const [id] of designs) cy.contains("button", `Use ${id}`).should("exist");
    cy.contains("button", "Use W09").click();
    cy.contains("label", "Invitation link name").find("input").type("classic-wedding");
    cy.contains("label", "First partner’s name").find("input").type("Amaya");
    cy.contains("label", "Second partner’s name").find("input").type("Sanjuka");
    cy.contains("label", "First partner’s family line").find("input").type("The Perera family");
    cy.contains("label", "Verse or quote").find("textarea").type("Two hearts, one beginning.");
    cy.contains("button", "Save draft").click();
    cy.wait("@saveClassic");
    cy.contains("button", "Preview invitation").click();
    cy.get('[data-classic-wedding="W09"]').within(() => {
      cy.contains("blockquote", "Two hearts, one beginning.").should("be.visible");
      cy.contains("small", "The Perera family").should("be.visible");
    });
  });
});
