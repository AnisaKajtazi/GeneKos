const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('genekos', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false
});

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.log('Database connection error: ', err));

module.exports = sequelize;
