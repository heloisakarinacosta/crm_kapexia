require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // Uncommented to enable auth routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://crm.kapexia.com.br', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})); // Enhanced CORS configuration
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  next();
});

// Basic Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Kapexia CRM Backend API!" });
});

// Auth Routes - enabled
app.use("/api/auth", authRoutes);

// TODO: Add other routes for admin configurations (subscription plans, AI configs, email templates, system integrations)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  // TODO: Initialize DB connection here
});

