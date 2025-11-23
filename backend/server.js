require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const sequelize = require('./src/config/db');
const User = require('./src/models/User');

const PORT = 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("All tables synced!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log("Sync error:", err));
