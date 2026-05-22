describe('GeneKos Appointments', () => {
  const user = {
    first_name: 'Appointment',
    last_name: 'Tester',
    username: `appt_tester_${Date.now()}`,
    email: `appt_tester_${Date.now()}@example.com`,
    password: 'Test1234',
    role: 'user',
    phone: '+383451234561',
    gender: 'other',
    date_of_birth: '1990-01-01',
    address: 'Prishtine',
  };

  const appointmentNote = `Appointment test note ${Date.now()}`;
  const targetDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const appointmentDate = targetDate.toISOString().split('T')[0];

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

      cy.visit('/dashboard/client/appointments', {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', token);
          win.localStorage.setItem('user', JSON.stringify(loggedUser));
        },
      });
    });
  });

  it('Should request a new appointment as a patient', () => {
    cy.url().should('include', '/dashboard/client/appointments');
    cy.contains('Takimet e Mia').should('be.visible');

    cy.intercept('GET', '/api/appointments/available*').as('availableSlots');

    cy.get('input[type="date"]').should('be.visible').clear().type(appointmentDate);
    cy.wait('@availableSlots');

    cy.get('select').should('not.be.disabled');
    cy.get('select option').should('have.length.greaterThan', 1);
    cy.get('select option').eq(1).then(($option) => {
      const slot = $option.val();
      expect(slot).to.match(/^\d{2}:\d{2}$/);
      cy.get('select').select(slot);
    });

    cy.get('input[placeholder="Shtoni shënim për takimin..."]').type(appointmentNote);

    cy.on('window:alert', (text) => {
      expect(text).to.include('Kërkesa për takim u dërgua me sukses');
    });

    cy.contains('button', 'Kërko Takim').click();

    cy.contains(appointmentNote, { timeout: 10000 }).should('exist');
  });
});
