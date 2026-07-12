const express = require("express");
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/profile", authenticate, authController.getProfile);

module.exports = router;
