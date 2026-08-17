import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/enquiries", enquiryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/users", userRoutes);
app.use("/api/users", userRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
