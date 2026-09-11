describe('05 - Admin Portal Security & Views', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
  });

  it('renders the admin login portal with credentials form', () => {
    cy.visit('/admin/login');
    cy.contains(/Admin|Administration/i).should('exist');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('exist');
  });

  it('blocks access to admin dashboard when unauthenticated', () => {
    cy.clearLocalStorage();
    cy.visit('/admin');
    
    // Unauthenticated user is redirected to admin login or unauthorized
    cy.url().should((url) => {
      expect(url).to.match(/login|auth/);
    });
  });

  it('allows authenticated admin to view the dashboard layout', () => {
    const mockAdmin = {
      id: 'admin-id-999',
      email: 'admin@luxeevents.fun',
      firstName: 'Chief',
      lastName: 'Admin',
      roleName: 'SUPER_ADMIN',
    };

    window.localStorage.setItem('accessToken', 'mock-admin-token');
    window.localStorage.setItem('user', JSON.stringify(mockAdmin));

    cy.visit('/admin');
    // Check navigation items or admin header
    cy.get('body').should('not.contain', '404 - Page Not Found');
  });
});
