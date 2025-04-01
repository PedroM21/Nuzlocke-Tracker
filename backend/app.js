import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import authRoutes from "./routes/authRoute.js";
import runsRoutes from "./routes/runsRoute.js";
import runsMiddleware from "./middleware/runsMiddleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the nuzlocke tracker");
});

// Routes
app.use("/auth", authRoutes);
app.use("/runs", runsMiddleware, runsRoutes);

app.listen(PORT, () => {
  console.log(`Nuzlocke Tracker API is running on http://localhost:${PORT}`);
});

export default app;
