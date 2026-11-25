describe("Birthday surprise cards", () => {
  it("takes a B02 snapshot, flips through the film reel and opens the bilingual wish", () => {
    cy.viewport(320, 568);
    cy.visit("/invitation-templates/b02");
    cy.get('[data-birthday-theme="B02"]').should("be.visible");
    cy.contains("h1", "Birthday Rewind").should("be.visible");
    cy.screenshot("rewind-camera-mobile", { capture: "viewport", disableTimersAndAnimations: false });
    cy.contains("button", "Take a snapshot").should(($button) => {
      const rect = $button[0].getBoundingClientRect();
      expect(rect.width).to.be.at.least(44);
      expect(rect.bottom).to.be.at.most(568);
    }).click();
    cy.get('[data-developing="true"]').should("exist");
    cy.contains("h1", "The memory reel").should("be.focused");
    cy.get('img[alt="The memory reel 1"]').should("have.prop", "naturalWidth").and("be.gt", 0);
    cy.get('[aria-label="Next photo"]').click();
    cy.contains("02 / 02").should("be.visible");
    cy.get('img[alt="The memory reel 2"]').parent()
      .trigger("touchstart", { touches: [{ clientX: 75, clientY: 100 }] })
      .trigger("touchend", { touches: [], changedTouches: [{ clientX: 150, clientY: 104 }] });
    cy.contains("01 / 02").should("be.visible");
    cy.get('img[alt="The memory reel 1"]').should("have.css", "opacity", "1");
    cy.screenshot("rewind-film-mobile", { capture: "viewport", disableTimersAndAnimations: false });
    cy.get('button[lang="si"]').click();
    cy.contains("button", "සුබපැතුම කියවන්න").click();
    cy.contains("සුබ උපන්දිනයක් අමායා!").should("be.visible");
    cy.get('[data-rewind-stage="wish"]').should("be.visible");
    cy.get('img[src*="rose-cake"]').should("not.exist");
    cy.document().its("documentElement.scrollWidth").should("be.lte", 320);
    cy.contains("button", "මුල සිට බලන්න").click();
    cy.contains("button", "ඡායාරූපයක් ගන්න").should("be.enabled").click();
    cy.contains("01 / 02").should("be.visible");
  });
  it("opens, blows out the candles, switches language, and browses memories", () => {
    cy.viewport(360, 800);
    cy.visit("/invitation-templates/b01");
    cy.contains("h1", "Amaya").should("be.visible");
    cy.get('[data-chapter="cover"]').should("be.visible");
    cy.screenshot("birthday-cover-mobile", { capture: "viewport", disableTimersAndAnimations: false });
    cy.get('button[aria-label="Untie the ribbon"]').click();
    cy.get('[data-unwrapping="true"]').should("be.visible");
    cy.contains("Make a wish").should("be.visible");
    cy.get('[data-chapter="cake"] img[src*="rose-cake"]').should("be.visible");
    cy.get('[data-chapter="cake"] h1').parent().should("have.css", "opacity", "1");
    cy.get("main h1").should("have.length", 1);
    cy.screenshot("birthday-cake-mobile", { capture: "viewport", disableTimersAndAnimations: false });
    cy.contains("button", "Blow out the candles").click();
    cy.contains("Happy birthday, Amaya!").should("be.visible");
    cy.get('[aria-label="Next photo"]').click();
    cy.contains("2 / 2").should("be.visible");
    cy.get('img[alt="Favourite memories 2"]').parent()
      .trigger("touchstart", { touches: [{ clientX: 75, clientY: 100 }] })
      .trigger("touchend", { touches: [], changedTouches: [{ clientX: 150, clientY: 104 }] });
    cy.contains("1 / 2").should("be.visible");
    cy.contains("button", "සිංහල").click();
    cy.contains("h1", "අමායා").should("be.visible");
    cy.contains("සුබ උපන්දිනයක් අමායා!").should("be.visible");
    cy.get('[data-chapter="wish"]').should("be.visible");
    cy.document().its("documentElement.scrollWidth").should("be.lte", 360);
    cy.contains("button", "නැවත බලන්න").click();
    cy.contains("button", "පුදුමය විවෘත කරන්න").should("be.visible");
    cy.get('[data-unwrapping="false"] button').should("be.enabled");
  });

  for (const [width, height] of [[320, 568], [430, 932]]) {
    it(`keeps the ribbon and candle controls on-screen at ${width} × ${height}`, () => {
      cy.viewport(width, height);
      cy.visit("/invitation-templates/b01");
      cy.get('button[aria-label="Untie the ribbon"]').should(($button) => {
        const rect = $button[0].getBoundingClientRect();
        expect(rect.width).to.be.at.least(44);
        expect(rect.bottom).to.be.at.most(height);
      }).click();
      cy.contains("button", "Blow out the candles").should(($button) => {
        const rect = $button[0].getBoundingClientRect();
        expect(rect.height).to.be.at.least(44);
        expect(rect.bottom).to.be.at.most(height);
      });
      cy.document().its("documentElement.scrollWidth").should("be.lte", width);
    });
  }

  it("keeps the desktop card in bounds when switching to Sinhala", () => {
    cy.viewport(1280, 850);
    cy.visit("/invitation-templates/b01");
    cy.get('[data-chapter="cover"]').should("be.visible");
    cy.get('button[lang="si"]').click();
    cy.contains("h1", "අමායා").should("be.visible");
    cy.get("main h1").should("have.length", 1);
    cy.document().its("documentElement.scrollWidth").should("be.lte", 1280);
    cy.screenshot("birthday-cover-desktop", { capture: "viewport", disableTimersAndAnimations: false });
  });

  for (const templateId of ["B01", "B02"]) {
  it(`creates a ${templateId} birthday draft without asking for wedding details`, () => {
    cy.intercept("GET", "**/invitation-studio/session", { body: { role: "ADMIN" } });
    cy.intercept("GET", "**/invitation-studio/invitations", { body: [] });
    cy.intercept("GET", "**/invitation-studio/settings", { body: { orderPhone: "" } });
    cy.intercept("POST", "**/invitation-studio/invitations", (req) => {
      expect(req.body.templateId).to.equal(templateId);
      expect(req.body.draft).to.include({
        partnerOne: "Amaya", welcome: "Happy birthday!", birthdayMessageSi: "සුබ උපන්දිනයක්!",
      });
      req.reply({ body: { ...req.body, id: "birthday-test", status: "DRAFT", revision: 1 } });
    }).as("saveBirthday");
    cy.visit("/invitation-studio", {
      onBeforeLoad(win) { win.sessionStorage.setItem("invitationStudioToken", "test"); },
    });
    cy.contains("button", "Create invitation").click();
    cy.contains("button", `Use ${templateId}`).click();
    cy.contains("label", "Wedding date & time").should("not.exist");
    cy.contains("label", "Invitation link name").find("input").type("happy-birthday-amaya");
    cy.contains("label", "Recipient’s name").find("input").type("Amaya");
    cy.contains("label", "Birthday message in English").find("textarea").type("Happy birthday!");
    cy.contains("label", "Birthday message in Sinhala").find("textarea").type("සුබ උපන්දිනයක්!");
    cy.contains("button", "Save draft").click();
    cy.wait("@saveBirthday");
    cy.contains("/birthday/happy-birthday-amaya").should("be.visible");
    cy.contains("button", "Preview invitation").click();
    cy.get(`[data-birthday-theme="${templateId}"]`).should("be.visible");
    if (templateId === "B02") {
      cy.contains("button", "Take a snapshot").click();
      cy.get('[data-rewind-stage="wish"]').should("contain.text", "Happy birthday!");
      cy.contains("button", "Back to photos").should("not.exist");
    } else {
      cy.contains("button", "Open your surprise").should("be.visible");
    }
  });
  }
});
