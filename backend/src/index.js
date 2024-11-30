import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

// Determine the environment and set the CORS origin accordingly
const corsOptions = {
  credentials: true,
  origin:
    process.env.NODE_ENV === "production"
      ? "https://chat.volatileviv.com" // Production URL
      : "http://localhost:5173", // Development URL
};

app.use(express.json());
app.use(cookieParser());

// Use CORS with conditional origin
app.use(cors(corsOptions));

// Enable preflight requests (OPTIONS)
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/isrunning", (req, res) => {
  res.send("yeah, all good");
});

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
