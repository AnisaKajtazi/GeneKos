const user = {
  first_name: 'Message',
  last_name: 'Tester',
  username: `msg_tester_${Date.now()}`,
  email: `msg_tester_${Date.now()}@example.com`,
  password: 'Test1234',
  role: 'user',
  phone: '+383451234562',
  gender: 'other',
  date_of_birth: '1990-01-01',
  address: 'Prishtine',
};

describe('GeneKos Messages', () => {
  const messageText = `Mesazh testues ${Date.now()}`;

  before(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/auth/register',
      body: user,
      failOnStatusCode: false,
    });

    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/auth/login',
      body: {
        username: user.username,
        password: user.password,
      },
    }).then((response) => {
      const { token, user: loggedUser } = response.body;
      expect(token).to.be.a('string');
      expect(loggedUser).to.have.property('id');

      cy.visit('/dashboard/chat', {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', token);
          win.localStorage.setItem('user', JSON.stringify(loggedUser));
        },
      });
    });
  });

  it('Should send a message to Klinika GeneKos and verify persistence after refresh', () => {
    cy.contains('.user-item', 'Klinika GeneKos', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.contains('.partner-name', 'Klinika GeneKos').should('be.visible');

    cy.intercept('POST', '/api/messages/send').as('sendMessage');

    cy.get('textarea.message-input')
      .should('be.visible')
      .clear()
      .type(messageText);

    cy.get('button.send-button').click();
    cy.wait('@sendMessage').its('response.statusCode').should('eq', 201);

    // The app currently persists the message to the conversation storage,
    // and the message is visible again after reloading and reopening the chat.
    cy.reload();
    cy.contains('.user-item', 'Klinika GeneKos', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.contains('.message-content', messageText, { timeout: 10000 })
      .should('be.visible');
  });
});
