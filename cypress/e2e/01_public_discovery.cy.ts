describe('01 - Public Discovery & Marketing Pages', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('loads the homepage and displays core discovery elements', () => {
    cy.visit('/');
    // Check main layout elements
    cy.get('header, nav').should('exist');
    cy.contains(/Find|Book|Discover|Explore/i).should('exist');
    
    // Check search input presence
    cy.get('input[type="text"], input[placeholder*="search" i], input[placeholder*="Search" i]').should('exist');
    
    // Check footer presence
    cy.get('footer').should('exist');
    cy.get('footer').contains(/Privacy|Terms|Contact/i).should('exist');
  });

  it('allows navigating to the Search page and applying queries', () => {
    cy.visit('/search');
    cy.url().should('include', '/search');
    
    // Check search controls
    cy.get('input').first().should('be.visible');
    cy.get('input').first().clear().type('Colombo{enter}');
  });

  it('loads the legal and informational pages cleanly without errors', () => {
    const pages = ['/about', '/contact', '/terms', '/privacy', '/faq'];
    
    pages.forEach((page) => {
      cy.visit(page);
      cy.get('h1, h2').should('be.visible');
      cy.get('body').should('not.contain', '404 - Page Not Found');
    });
  });

  it('renders a public vendor storefront with all detail tabs', () => {
    // Visit search to find a business or visit directly if known
    cy.visit('/search');
    
    // Click on the first business card link if available
    cy.get('body').then(($body) => {
      const links = $body.find('a[href*="/business/"]');
      if (links.length > 0) {
        cy.wrap(links.first()).click();
        cy.url().should('include', '/business/');
        
        // Check core storefront elements
        cy.get('h1').should('be.visible');
        cy.contains(/Book This Vendor|Contact Vendor|Request Quote/i).should('exist');
        
        // Check tab interaction
        cy.contains(/Packages|Services/i).should('exist');
        cy.contains(/Policies|Terms/i).should('exist');
      } else {
        cy.log('No businesses found on search page to click; skipping dynamic card click');
      }
    });
  });

  it('renders the interactive 25 Districts of Sri Lanka coverage map and directory', () => {
    cy.visit('/locations');
    cy.contains('25 Districts').should('be.visible');
    cy.contains('Interactive Sri Lanka Coverage Map').should('be.visible');
    cy.contains('Colombo').should('be.visible');
    cy.contains('Kandy').should('be.visible');
    cy.contains('Galle').should('be.visible');
    cy.contains('Jaffna').should('be.visible');

    // Filter by Northern province
    cy.contains('button', 'Northern').click();
    cy.contains('Jaffna').should('be.visible');
    cy.contains('Kilinochchi').should('be.visible');
    cy.contains('Mannar').should('be.visible');
    cy.contains('Vavuniya').should('be.visible');
    cy.contains('Mullaitivu').should('be.visible');

    // Search for a district
    cy.get('input[placeholder*="Search district"]').type('Galle');
    cy.contains('Galle Fort').should('be.visible');
    cy.contains('button', /Browse All Galle Vendors|Explore Galle Vendors/i).should('be.visible');
  });
});
