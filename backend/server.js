require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: "http://localhost:3000", // vendi ku vjen frontend-i
  credentials: true               // lejon cookies dhe autorizime
}));

app.use(express.json());


const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const sequelize = require('./src/config/db');
const User = require('./src/models/User');
const Activity = require('./src/models/Activity');
const AnalysisResult = require('./src/models/AnalysisResult');
const AppointmentRequest = require('./src/models/AppointmentRequest');
const Diet = require('./src/models/Diet');
const UserHealthProfile = require('./src/models/UserHealthProfile');
const Message = require('./src/models/messageModel');



const analysisResultRoutes = require('./src/routes/analysisResultRoutes');
app.use('/api/analysis-results', analysisResultRoutes);
app.use('/uploads', express.static('uploads'));

const messageRoutes = require("./src/routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const userRoutes = require("./src/routes/usersRoutes");
app.use("/api/users", userRoutes);





const PORT = 5000;

sequelize.sync({ forced: true })

  .then(() => {
    console.log("All tables synced!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log("Sync error:", err));
