const express = require("express");
const config = require("../config");
const indexRoutes = require("./index.routes");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.use("/", indexRoutes);
router.use(config.apiPrefix, healthRoutes);
router.use(config.apiPrefix, authRoutes);

module.exports = router;
