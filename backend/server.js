require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const authRoutes = require("./src/presentation/routes/authRoutes");
const appointmentRoutes = require("./src/presentation/routes/appointmentRoutes");
const analysisResultRoutes = require("./src/presentation/routes/analysisResultRoutes");
const messageRoutes = require("./src/presentation/routes/messageRoutes");
const userRoutes = require("./src/presentation/routes/usersRoutes");
const activityRoutes = require('./src/presentation/routes/activityRoutes');
const dietRoutes = require('./src/presentation/routes/dietRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analysis", analysisResultRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/diets", dietRoutes);

const sequelize = require("./src/infrastructure/config/db");

const User = require("./src/domain/models/User");
const Activity = require("./src/domain/models/Activity");
const AnalysisResult = require("./src/domain/models/AnalysisResult");
const AppointmentRequest = require("./src/domain/models/AppointmentRequest");
const Diet = require("./src/domain/models/Diet");
const UserHealthProfile = require("./src/domain/models/UserHealthProfile");
const Message = require("./src/domain/models/Message");

AppointmentRequest.hasMany(AnalysisResult, { foreignKey: 'request_id' });
AnalysisResult.belongsTo(AppointmentRequest, { foreignKey: 'request_id' });

cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();

    const scheduledAppointments = await AppointmentRequest.findAll({
      where: { status: "scheduled" },
    });

    for (const ap of scheduledAppointments) {
      if (new Date(ap.scheduled_date) < now) {
        ap.status = "missed";
        await ap.save();
        console.log(`Appointment ID ${ap.id} marked as missed`);
      }
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", ({ userId, role }) => {
    socket.join(String(userId));
    socket.data = { userId, role };

    if (role === "clinic") {
      socket.join("clinic");
    }

    console.log(`Registered -> userId=${userId} | role=${role}`);
  });

  socket.on("sendMessage", async ({ to, message }) => {
    const senderId = socket.data.userId;
    const senderRole = socket.data.role;

    if (senderRole === "user" && to !== "clinic") {
      console.log(`User ${senderId} tried to message non-clinic.`);
      return;
    }

    if (to === "clinic") {
      io.to("clinic").emit("receiveMessage", { from: senderId, message });
    } else {
      io.to(String(to)).emit("receiveMessage", { from: senderId, message });
    }

    try {
      await Message.create({
        senderId,
        receiverId: to === "clinic" ? null : to,
        content: message,
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("All tables synced!");
    httpServer.listen(PORT, () => {
      console.log(`[BACKEND] Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Sync error:", err);
  });
