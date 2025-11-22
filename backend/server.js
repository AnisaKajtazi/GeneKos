const sequelize = require('./src/config/db');
const User = require('./src/models/User');

sequelize.sync({ alter: true })
  .then(() => console.log("All tables synced!"))
  .catch(err => console.log("Sync error:", err));
