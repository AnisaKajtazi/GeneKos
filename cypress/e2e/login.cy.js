const testUser = {
  first_name: 'Demo',
  last_name: 'User',
  username: 'demo_user',
  email: 'demo_user@example.com',
  password: 'demo123',
  role: 'user',
  phone: '+38300000000',
  gender: 'other',
  date_of_birth: '1990-01-01',
  address: 'Prishtine',
};

describe('GeneKos Login', () => {
  before(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/auth/register',
      body: testUser,
      failOnStatusCode: false,
    });
  });

  it('Login me kredenciale valide', () => {
    cy.visit('/')

    cy.get('input[name="username"]').should('be.visible').type('demo_user')
    cy.get('input[name="password"]').should('be.visible').type('demo123')

    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
  })

})