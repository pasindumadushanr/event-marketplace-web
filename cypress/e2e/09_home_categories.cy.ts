import { homeCategories } from '../../src/lib/home-categories';

describe('Homepage category search', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/business-categories', { body: [
      { id: 'transport', name: 'Wedding Cars & Transport', slug: 'wedding-cars-transport', parentId: null },
      { id: 'cars', name: 'Wedding Cars', slug: 'wedding-cars', parentId: 'transport' },
    ] }).as('categories');
    cy.intercept('GET', '**/discovery/search*', (req) => {
      if (!new URL(req.url).searchParams.has('limit')) req.alias = 'search';
      req.reply({ body: { data: [], meta: { total: 0 } } });
    });
  });

  it('shows all requested labels in order', () => {
    cy.visit('/');
    cy.get('select[aria-label="Category"] option').then(($options) => {
      expect([...$options].map((option) => option.textContent)).to.deep.equal([
        'All Categories', 'Venues & Halls', 'Photography & Video', 'Bridal & Groom Wear',
        'Salons & Makeup', 'Floral & Decor', 'Catering & Cakes', 'Jewellery',
        'Bands & DJ Music', 'Wedding Planners', 'Traditional & Poruwa',
        'Invitations & Cards', 'Wedding Cars', 'Event Security',
      ]);
    });
    expect(new Set(homeCategories.map((item) => item.slug)).size).to.equal(13);
  });

  it('passes category, keyword, and location to search and retains the selection', () => {
    cy.viewport(390, 844);
    cy.visit('/');
    cy.wait('@categories');
    cy.get('select[aria-label="Category"]').select('Wedding Cars');
    cy.get('input[placeholder="What are you looking for?"]').type('classic');
    cy.get('select[aria-label="Location"]').select('Colombo');
    cy.get('select[aria-label="Category"]').should('have.value', 'wedding-cars');
    cy.get('input[placeholder="What are you looking for?"]').should('have.value', 'classic');
    cy.get('select[aria-label="Category"]').closest('form').contains('button', 'Search').click();
    cy.location('search').should('include', 'categorySlug=wedding-cars');
    cy.wait('@search').then(({ request }) => {
      const params = new URL(request.url).searchParams;
      expect(params.get('categorySlug')).to.equal('wedding-cars');
      expect(params.get('q')).to.equal('classic');
      expect(params.get('city')).to.equal('Colombo');
    });
    cy.contains('label', 'Subcategory').find('select').should('have.value', 'cars');
    cy.contains('button', 'Apply Filters').click();
    cy.wait('@search').its('request.url').should('include', 'categorySlug=wedding-cars');
    cy.intercept('GET', '**/discovery/search*', { body: { data: [], meta: { total: 0 } } }).as('clearedSearch');
    cy.contains('label', 'Main category').find('select').select('');
    cy.contains('label', 'Main category').find('select').should('have.value', '');
    cy.contains('label', 'Subcategory').should('not.exist');
    cy.contains('button', 'Apply Filters').click();
    cy.wait('@clearedSearch').its('request.url').should('not.include', 'categorySlug').and('not.include', 'categoryId');
  });
});
