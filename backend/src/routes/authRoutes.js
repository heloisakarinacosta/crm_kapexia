const express = require("express");
const authController = require("../controllers/authController");
// const { verifyToken } = require('../middleware/authMiddleware'); // Placeholder for token verification middleware

const router = express.Router();

// @route   POST api/auth/login
// @desc    Authenticate user (admin) and get token
// @access  Public
router.post("/login", authController.login);

// @route   POST api/auth/register-admin
// @desc    Register a new admin (should be protected or for initial setup)
// @access  Restricted
router.post("/register-admin", authController.registerAdmin);

// Example of a protected route that would require token verification
// router.get("/profile", verifyToken, authController.getProfile);

module.exports = router;

