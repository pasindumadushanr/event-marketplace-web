import { policyDefaults } from "../../src/data/policies";

const termsSlug = "terms-and-conditions";
function adminVisit(path: string) {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem("accessToken", "test-admin");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "admin",
          firstName: "Test",
          roleName: "SUPER_ADMIN",
        }),
      );
    },
  });
}

describe("Admin content connected to public pages", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/admin/cms/public/settings/*", { body: {} });
    cy.intercept("GET", "**/admin/cms/public/faqs", { body: [] });
  });

  it("keeps draft edits private until Publish, and supports preview without saving", () => {
    let draft = {
      id: "terms-page",
      slug: termsSlug,
      title: "Terms of Service",
      content: "<p>Original live wording</p>",
      status: "PUBLISHED",
      updatedAt: "2026-10-02T00:00:00Z",
    };
    let live = { ...draft };
    let writes = 0;
    cy.intercept("GET", `**/admin/cms/pages/${termsSlug}`, (req) =>
      req.reply({ body: draft }),
    );
    cy.intercept("GET", `**/admin/cms/public/pages/${termsSlug}`, (req) =>
      req.reply({ body: live }),
    ).as("publicTerms");
    cy.intercept("PATCH", "**/admin/cms/pages/terms-page", (req) => {
      writes++;
      draft = { ...draft, ...req.body, updatedAt: "2026-10-15T00:00:00Z" };
      if (req.body.status === "PUBLISHED") live = { ...draft };
      req.reply({ body: draft });
    }).as("savePage");
    adminVisit(`/admin/cms/pages/editor?slug=${termsSlug}`);
    cy.get("#page-slug").should("be.disabled").and("have.value", termsSlug);
    cy.get(".ql-editor")
      .should("contain", "Original live wording")
      .clear()
      .type("New owner-reviewed wording");
    cy.contains("button", "Preview").click();
    cy.get('[aria-label="Private page preview"]').should(
      "contain",
      "New owner-reviewed wording",
    );
    cy.then(() => expect(writes).to.equal(0));
    cy.contains("button", "Save Draft").click();
    cy.wait("@savePage").its("request.body.status").should("equal", "DRAFT");
    cy.visit("/terms");
    cy.wait("@publicTerms");
    cy.get("[data-policy-content]")
      .should("contain", "Original live wording")
      .and("not.contain", "New owner-reviewed wording");
    cy.get("main time").should("have.attr", "datetime", "2026-10-02T00:00:00Z");
    adminVisit(`/admin/cms/pages/editor?slug=${termsSlug}`);
    cy.get(".ql-editor").should("contain", "New owner-reviewed wording");
    cy.window().then((win) =>
      cy.wrap(cy.stub(win, "confirm").returns(false)).as("cancelPublish"),
    );
    cy.contains("button", "Publish Now").click();
    cy.get("@cancelPublish").should("have.been.calledOnce");
    cy.then(() => expect(writes).to.equal(1));
    cy.get("@cancelPublish").invoke("restore");
    cy.contains("button", "Publish Now").click();
    cy.wait("@savePage")
      .its("request.body.status")
      .should("equal", "PUBLISHED");
    cy.visit("/terms");
    cy.wait("@publicTerms");
    cy.get("[data-policy-content]").should(
      "contain",
      "New owner-reviewed wording",
    );
    cy.get("main time").should("have.attr", "datetime", "2026-10-15T00:00:00Z");
  });

  it("starts missing policies as editable drafts and saves only on request", () => {
    let writes = 0;
    cy.intercept("GET", "**/admin/cms/pages/privacy-policy", {
      statusCode: 404,
    });
    cy.intercept("POST", "**/admin/cms/pages", (req) => {
      writes++;
      req.reply({ body: { ...req.body, id: "new-privacy" } });
    }).as("create");
    cy.intercept("PATCH", "**/admin/cms/pages/new-privacy", (req) => {
      writes++;
      req.reply({ body: { ...req.body, id: "new-privacy" } });
    }).as("update");
    adminVisit("/admin/cms/pages/editor?slug=privacy-policy");
    cy.get("#page-title").should("have.value", "Privacy Policy");
    cy.get(".ql-editor").should("contain", "Google Analytics");
    cy.then(() => expect(writes).to.equal(0));
    cy.contains("button", "Save Draft").click();
    cy.wait("@create").its("request.body.status").should("equal", "DRAFT");
    cy.contains("button", "Save Draft").click();
    cy.wait("@update");
    cy.then(() => expect(writes).to.equal(2));
  });

  it("blocks editing on load failures and retains text when saving fails", () => {
    cy.intercept("GET", `**/admin/cms/pages/${termsSlug}`, { statusCode: 500 });
    adminVisit(`/admin/cms/pages/editor?slug=${termsSlug}`);
    cy.contains("No changes have been made.").should("be.visible");
    cy.contains("button", "Save Draft").should("not.exist");
    cy.intercept("GET", `**/admin/cms/pages/${termsSlug}`, {
      body: {
        id: "terms-page",
        title: "Terms",
        slug: termsSlug,
        content: "<p>Editable copy</p>",
        status: "DRAFT",
      },
    });
    cy.contains("button", "Retry").click();
    cy.get(".ql-editor")
      .should("contain", "Editable copy")
      .clear()
      .type("Keep this unsaved draft");
    cy.intercept("PATCH", "**/admin/cms/pages/terms-page", {
      statusCode: 500,
    }).as("failedSave");
    cy.contains("button", "Save Draft").click();
    cy.wait("@failedSave");
    cy.get(".ql-editor").should("contain", "Keep this unsaved draft");
    cy.contains("button", "Preview").click();
    cy.get('[aria-label="Private page preview"]').should(
      "contain",
      "Keep this unsaved draft",
    );
  });

  it("keeps the last published policy on outages and sanitizes dangerous HTML", () => {
    const live = {
      slug: "privacy-policy",
      title: "Privacy Policy",
      updatedAt: "2026-10-16T00:00:00Z",
      content:
        '<h2>Safe published heading</h2><p>Stored public wording.</p><script>window.policyAttack=true</script><img src=x onerror="window.policyAttack=true"><a href="javascript:alert(1)">Bad link</a><a href="/contact">Contact</a>',
    };
    cy.intercept("GET", "**/admin/cms/public/pages/privacy-policy", {
      body: live,
    }).as("privacy");
    cy.visit("/privacy");
    cy.wait("@privacy");
    cy.get("[data-policy-content]").should("contain", "Stored public wording.");
    cy.get("[data-policy-content] script, [data-policy-content] img").should(
      "not.exist",
    );
    cy.get("[data-policy-content] a").first().should("not.have.attr", "href");
    cy.get('[data-policy-content] a[href="/contact"]').should("exist");
    cy.window().its("policyAttack").should("be.undefined");
    cy.intercept("GET", "**/admin/cms/public/pages/privacy-policy", {
      statusCode: 503,
    }).as("outage");
    cy.reload();
    cy.wait("@outage");
    cy.get("[data-policy-content]").should("contain", "Stored public wording.");
    cy.get("main time").should("have.attr", "datetime", live.updatedAt);
  });

  it("refuses draft writes against the older backend during deployment", () => {
    let writes = 0;
    cy.intercept("GET", `**/admin/cms/pages/${termsSlug}`, {
      body: {
        id: "terms-page",
        title: "Terms",
        slug: termsSlug,
        content: "<p>Live old-backend copy</p>",
        status: "PUBLISHED",
      },
    });
    cy.intercept("GET", "**/admin/cms/public/faqs", { statusCode: 404 });
    cy.intercept("PATCH", "**/admin/cms/pages/terms-page", (req) => {
      writes++;
      req.reply({ body: { ...req.body, id: "terms-page" } });
    }).as("safeSave");
    adminVisit(`/admin/cms/pages/editor?slug=${termsSlug}`);
    cy.get(".ql-editor")
      .should("contain", "Live old-backend copy")
      .clear()
      .type("Retain this private draft");
    cy.contains("button", "Save Draft").click();
    cy.contains("Check the latest Render deployment before saving.").should(
      "be.visible",
    );
    cy.then(() => expect(writes).to.equal(0));
    cy.get(".ql-editor").should("contain", "Retain this private draft");
    cy.intercept("GET", "**/admin/cms/public/faqs", { body: [] });
    cy.contains("button", "Save Draft").click();
    cy.wait("@safeSave").its("request.body.status").should("equal", "DRAFT");
    cy.then(() => expect(writes).to.equal(1));
  });

  it("connects FAQ creation, ordering, editing, and visibility to the public page", () => {
    let faqs = [
      {
        id: "old",
        question: "Older question?",
        answer: "Older answer.",
        category: "GENERAL",
        sortOrder: 10,
        isActive: true,
      },
    ];
    cy.intercept("GET", "**/admin/cms/faqs", (req) =>
      req.reply({ body: faqs }),
    );
    cy.intercept("GET", "**/admin/cms/public/faqs", (req) =>
      req.reply({ body: faqs.filter((item) => item.isActive) }),
    ).as("publicFaqs");
    cy.intercept("POST", "**/admin/cms/faqs", (req) => {
      const faq = { id: "new", ...req.body };
      faqs.push(faq);
      req.reply({ body: faq });
    }).as("createFaq");
    cy.intercept("PATCH", "**/admin/cms/faqs/new", (req) => {
      faqs = faqs.map((item) =>
        item.id === "new" ? { ...item, ...req.body } : item,
      );
      req.reply({ body: faqs.find((item) => item.id === "new") });
    }).as("editFaq");
    adminVisit("/admin/cms/faq");
    cy.contains("button", "Add New FAQ").click();
    cy.get("#faq-question").type("Can I find Walasmulla vendors?");
    cy.get("#faq-answer").type("Enter Walasmulla in the town search.");
    cy.get("#faq-sort").clear().type("1");
    cy.contains("button", "Save FAQ").click();
    cy.wait("@createFaq").its("request.body.sortOrder").should("equal", 1);
    cy.visit("/faq");
    cy.wait("@publicFaqs");
    cy.get('button[data-slot="accordion-trigger"]')
      .first()
      .should("contain", "Walasmulla");
    cy.contains("button", "Can I find Walasmulla vendors?").click();
    cy.contains("Enter Walasmulla in the town search.").should("be.visible");
    adminVisit("/admin/cms/faq");
    cy.get('button[aria-label="Edit Can I find Walasmulla vendors?"]').click();
    cy.get("#faq-answer").clear().type("Updated town-search guidance.");
    cy.get("#faq-category").clear().type("LOCATIONS");
    cy.contains("button", "Save FAQ").click();
    cy.wait("@editFaq");
    cy.visit("/faq");
    cy.wait("@publicFaqs");
    cy.contains("button", "Locations").click();
    cy.contains("button", "Can I find Walasmulla vendors?").click();
    cy.contains("Updated town-search guidance.").should("be.visible");
    adminVisit("/admin/cms/faq");
    cy.get('[aria-label="Show Can I find Walasmulla vendors?"]').click();
    cy.wait("@editFaq");
    cy.visit("/faq");
    cy.wait("@publicFaqs");
    cy.contains("button", "Can I find Walasmulla vendors?").should("not.exist");
    cy.contains("button", "Locations").should("not.exist");
  });

  it("retains saved FAQ during outages but respects an intentionally empty public list", () => {
    const items = [
      {
        id: "saved",
        question: "Saved public question?",
        answer: "Saved public answer.",
        category: "GENERAL",
        sortOrder: 0,
      },
    ];
    cy.intercept("GET", "**/admin/cms/public/faqs", { body: items }).as("faqs");
    cy.visit("/faq");
    cy.wait("@faqs");
    cy.contains("button", "Saved public question?").should("be.visible");
    cy.intercept("GET", "**/admin/cms/public/faqs", { statusCode: 503 }).as(
      "faqOutage",
    );
    cy.reload();
    cy.wait("@faqOutage");
    cy.contains("button", "Saved public question?").should("be.visible");
    cy.contains("Showing saved help information").should("be.visible");
    cy.intercept("GET", "**/admin/cms/public/faqs", { body: [] }).as("empty");
    cy.reload();
    cy.wait("@empty");
    cy.contains("Questions are being updated").should("be.visible");
    cy.contains("button", "Saved public question?").should("not.exist");
    cy.contains("button", "What is Nakathata.lk?").should("not.exist");
  });

  it("keeps policy titles below mobile navigation and does not overflow", () => {
    cy.viewport(320, 720);
    cy.intercept("GET", "**/admin/cms/public/pages/*", (req) => {
      const slug = req.url.split("/").pop()!;
      req.reply({
        body: { ...policyDefaults[slug], updatedAt: "2026-10-16T00:00:00Z" },
      });
    }).as("mobilePolicy");
    ["/terms", "/privacy"].forEach((path) => {
      cy.visit(path);
      cy.wait("@mobilePolicy");
      cy.get('button[aria-label="Open navigation menu"]')
        .should("have.class", "text-slate-900")
        .and("not.have.css", "color", "rgb(255, 255, 255)");
      cy.get("main h1")
        .should("be.visible")
        .then(($heading) => {
          cy.get('[aria-label="Breadcrumb"]').then(($nav) =>
            expect($heading[0].getBoundingClientRect().top).to.be.greaterThan(
              $nav[0].getBoundingClientRect().bottom,
            ),
          );
        });
      cy.document().then((doc) =>
        expect(doc.documentElement.scrollWidth).to.be.at.most(320),
      );
    });
  });
});
