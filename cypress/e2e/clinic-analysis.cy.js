describe('Clinic Patient Data - Analizat', () => {
  const clinicUser = {
    first_name: 'Clinic',
    last_name: 'Tester',
    username: `clinic_tester_${Date.now()}`,
    email: `clinic_tester_${Date.now()}@example.com`,
    password: 'Clinic1234',
    role: 'clinic',
    phone: '+383451234560',
    gender: 'other',
    date_of_birth: '1990-01-01',
    address: 'Prishtine',
  };

  const patientUser = {
    first_name: 'Patient',
    last_name: 'Analysis',
    username: `patient_analysis_${Date.now()}`,
    email: `patient_analysis_${Date.now()}@example.com`,
    password: 'Patient1234',
    role: 'user',
    phone: '+383451234562',
    gender: 'other',
    date_of_birth: '1992-02-02',
    address: 'Prishtine',
  };

  const appointmentNote = `Test appointment for analysis ${Date.now()}`;
  const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  futureDate.setHours(9, 0, 0, 0);
  const pad = (value) => value.toString().padStart(2, '0');
  const scheduledDate = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())}T${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}`;
  let authToken = null;
  let clinicProfile = null;
  let patientProfile = null;
  let completedAppointmentId = null;

  before(() => {
    return cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/auth/register',
      body: clinicUser,
      failOnStatusCode: false,
    }).then(() => {
      return cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/register',
        body: patientUser,
        failOnStatusCode: false,
      });
    }).then(() => {
      return cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        body: {
          username: patientUser.username,
          password: patientUser.password,
        },
      });
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      expect(loginResponse.body.user).to.have.property('id');
      patientProfile = loginResponse.body.user;
      return cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',
        body: {
          username: clinicUser.username,
          password: clinicUser.password,
        },
      });
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.user).to.have.property('id');
      authToken = response.body.token;
      clinicProfile = response.body.user;
      return cy.task('createCompletedAppointment', {
        userId: patientProfile.id,
        scheduledDate,
        note: appointmentNote,
      });
    }).then((appointment) => {
      expect(appointment).to.have.property('id');
      completedAppointmentId = appointment.id;
    });
  });

  it('adds a new analysis for a completed appointment patient', () => {
    cy.visit('/dashboard/clinic/PatientData', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', authToken);
        win.localStorage.setItem('user', JSON.stringify(clinicProfile));
      },
    });

    cy.contains('Shto të dhënat e pacientit').should('be.visible');

    cy.intercept('GET', '/api/appointments/user/*').as('getAppointments');
    cy.intercept('GET', '/api/analysis/user/*').as('getAnalyses');

    cy.get('input[placeholder="Shkruaj emrin ose ID e pacientit..."]')
      .should('be.visible')
      .type(patientUser.username);

    cy.contains('.patient-result-name', `${patientUser.first_name} ${patientUser.last_name}`, { timeout: 10000 }).click();

    cy.wait('@getAppointments');
    cy.wait('@getAnalyses');

    cy.contains('.form-card-title span', 'Analizat')
      .closest('.form-card-wide')
      .within(() => {
        cy.get('select').should('exist').select(1);
        cy.get('input[placeholder="P.sh: Analizë gjaku"]').type('Analizë testimi');
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-analysis.pdf', { force: true });
        cy.intercept('POST', '/api/analysis/upload').as('uploadAnalysis');
        cy.contains('button', 'Shto Analizë').click();
        cy.wait('@uploadAnalysis');
        cy.contains('Analiza u shtua me sukses!', { timeout: 10000 }).should('be.visible');
        cy.contains('Analizë testimi', { timeout: 10000 }).should('be.visible');
      });
  });
});