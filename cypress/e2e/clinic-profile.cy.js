describe('Clinic Patient Data - Profili Shëndetësor', () => {
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
    last_name: 'Profile',
    username: `patient_profile_${Date.now()}`,
    email: `patient_profile_${Date.now()}@example.com`,
    password: 'Patient1234',
    role: 'user',
    phone: '+383451234565',
    gender: 'other',
    date_of_birth: '1993-05-05',
    address: 'Prishtine',
  };

  const profileData = {
    height: '175',
    weight: '70',
    blood_type: 'A+',
    allergies: 'Nuk ka alergji të njohura.',
    medical_conditions: 'Asnjë gjendje kronike.',
    medications: 'Nuk përdor medikamente.',
  };

  const appointmentNote = `Test appointment for profile ${Date.now()}`;
  const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  futureDate.setHours(9, 0, 0, 0);
  const pad = (value) => value.toString().padStart(2, '0');
  const scheduledDate = `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-${pad(futureDate.getDate())}T${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}`;

  let authToken = null;
  let clinicProfile = null;
  let patientProfile = null;

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
    });
  });

  it('creates a new health profile for a completed appointment patient', () => {
    cy.visit('/dashboard/clinic/PatientData', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', authToken);
        win.localStorage.setItem('user', JSON.stringify(clinicProfile));
      },
    });

    cy.contains('Shto të dhënat e pacientit').should('be.visible');

    cy.intercept('GET', '/api/appointments/user/*').as('getAppointments');
    cy.intercept('GET', '/api/user-health-profile/user/*').as('getProfiles');

    cy.get('input[placeholder="Shkruaj emrin ose ID e pacientit..."]')
      .should('be.visible')
      .type(patientUser.username);

    cy.contains('.patient-result-name', `${patientUser.first_name} ${patientUser.last_name}`, { timeout: 10000 }).click();

    cy.wait('@getAppointments');

    cy.contains('button', 'Profili i Shëndetit të Pacientit').click();
    cy.wait('@getProfiles');

    cy.contains('h2', 'Krijo Profil të Ri').should('be.visible');

    cy.contains('h2', 'Krijo Profil të Ri')
      .closest('div')
      .within(() => {
        cy.get('select').first().should('exist').select(1);
        cy.get('input[name="height"]').clear().type(profileData.height);
        cy.get('input[name="weight"]').clear().type(profileData.weight);
        cy.get('input[name="blood_type"]').clear().type(profileData.blood_type);
        cy.get('textarea[name="allergies"]').clear().type(profileData.allergies);
        cy.get('textarea[name="medical_conditions"]').clear().type(profileData.medical_conditions);
        cy.get('textarea[name="medications"]').clear().type(profileData.medications);

        cy.intercept('POST', '/api/user-health-profile').as('createHealthProfile');
        cy.contains('button', 'Shto Profilin e Ri').click();
        cy.wait('@createHealthProfile');
        cy.contains('Profili u krijua me sukses!', { timeout: 10000 }).should('be.visible');
      });

    cy.contains('Gjatësia', { timeout: 10000 }).should('be.visible');
    cy.contains('Pesha').should('be.visible');
    cy.contains('Tipi i Gjakut').should('be.visible');
    cy.contains('Historiku i Profileve').should('be.visible');
    cy.contains('1 Profil').should('be.visible');
  });
});