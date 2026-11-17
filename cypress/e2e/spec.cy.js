describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')

    cy.get("h1").should('have text', 'Connexion')

    cy.get('input)
  });

  it('test de base', function() {});
})