require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true               
}));

app.use(express.json());


const authRoutes = require('./src/presentation/routes/authRoutes');
const appointmentRoutes = require('./src/presentation/routes/appointmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);


const sequelize = require('./src/infrastructure/config/db');

const User = require('./src/domain/models/User');
const Activity = require('./src/domain/models/Activity');
const AnalysisResult = require('./src/domain/models/AnalysisResult');
const AppointmentRequest = require('./src/domain/models/AppointmentRequest');
const Diet = require('./src/domain/models/Diet');
const UserHealthProfile = require('./src/domain/models/UserHealthProfile');
const Message = require('./src/domain/models/messageModel');



const analysisResultRoutes = require('./src/presentation/routes/analysisResultRoutes');
app.use('/api/analysis-results', analysisResultRoutes);
app.use('/uploads', express.static('uploads'));

const messageRoutes = require("./src/presentation/routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const userRoutes = require("./src/presentation/routes/usersRoutes");
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log("All tables synced!");
    app.listen(PORT, () => {
      console.log(`[BACKEND] Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Sync error:", err);
  });
