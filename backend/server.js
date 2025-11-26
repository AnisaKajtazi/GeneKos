require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true               
}));

app.use(express.json());


const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);


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




const messageRoutes = require("./src/routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const userRoutes = require("./src/routes/usersRoutes");
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
