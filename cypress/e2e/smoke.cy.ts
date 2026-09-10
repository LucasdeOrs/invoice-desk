describe('Invoice Desk — smoke', () => {
  it('boots the application shell', () => {
    cy.visit('/');
    cy.get('app-root').should('exist');
  });
});
