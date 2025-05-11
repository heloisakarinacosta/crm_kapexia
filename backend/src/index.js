require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const authRoutes = require("./routes/authRoutes"); // To be uncommented later

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Basic CORS configuration, adjust as needed
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Kapexia CRM Backend API!" });
});

// Auth Routes - to be enabled once implemented
// app.use("/api/auth", authRoutes);

// TODO: Add other routes for admin configurations (subscription plans, AI configs, email templates, system integrations)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  // TODO: Initialize DB connection here
});

