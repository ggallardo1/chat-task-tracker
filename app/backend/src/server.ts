import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // 1. Import CORS

import chatRoute from "./routes/chat.route";
import taskRoute from "./routes/task.route";
import adminRoute from "./routes/admin.route";

dotenv.config();

const app = express();

// 2. Enable CORS so the Frontend can talk to the Backend
app.use(cors()); 

app.use(express.json());

// Routes
app.use("/chat", chatRoute);
app.use("/tasks", taskRoute);
app.use("/admin", adminRoute);

// 3. Health Check (Highly recommended for testing)
app.get("/health", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;

// 4. Bind to '0.0.0.0' for Docker compatibility
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
