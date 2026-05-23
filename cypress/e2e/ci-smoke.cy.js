describe('GeneKos CI smoke tests', () => {
  const user = {
    first_name: 'CI',
    last_name: 'Tester',
    username: `ci_tester_${Date.now()}`,
    email: `ci_tester_${Date.now()}@example.com`,
    password: 'Test1234',
    role: 'user',
    phone: '+383451230000',
    gender: 'other',
    date_of_birth: '1990-01-01',
    address: 'Prishtine',
  };

  it('registers a new user through the API', () => {
    cy.request('POST', 'http://localhost:5000/api/auth/register', user)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.contain('User u krijua me sukses');
        expect(response.body.user).to.have.property('id');
      });
  });

  it('logs in with valid credentials through the API', () => {
    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      username: user.username,
      password: user.password,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body.user.username).to.eq(user.username);
    });
  });

  it('rejects invalid login credentials', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5000/api/auth/login',
      body: {
        username: user.username,
        password: 'wrong-password',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Invalid password');
    });
  });
});
