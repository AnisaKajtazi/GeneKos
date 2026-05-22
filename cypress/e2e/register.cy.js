describe('GeneKos Register', () => {
  const user = {
    first_name: 'Test',
    last_name: 'User',
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: 'Test1234',
    role: 'user',
    phone: '+383451234560',
    gender: 'other',
    date_of_birth: '1990-01-01',
    address: 'Prishtine',
  };

  it('Register me te dhenat e sakta dhe shkon te faqja e login', () => {
    cy.visit('/register');

    cy.get('input[name="first_name"]').should('be.visible').type(user.first_name);
    cy.get('input[name="last_name"]').should('be.visible').type(user.last_name);
    cy.get('input[name="username"]').should('be.visible').type(user.username);
    cy.get('input[name="email"]').should('be.visible').type(user.email);
    cy.get('input[name="password"]').should('be.visible').type(user.password);
    cy.get('input[name="phone"]').should('be.visible').type(user.phone);
    cy.get('input[name="date_of_birth"]').should('be.visible').type(user.date_of_birth);
    cy.get('select[name="gender"]').should('be.visible').select(user.gender);
    cy.get('input[name="address"]').should('be.visible').type(user.address);

    cy.on('window:alert', (text) => {
      expect(text).to.contain('Regjistrimi u krye me sukses');
    });

    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.contains('Mirë se vini').should('exist');
    cy.get('button[type="submit"]').contains('Hyni');
  });
});
