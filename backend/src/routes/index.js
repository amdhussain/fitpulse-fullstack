const express = require('express');
const v1Routes = require('./api/v1');

const router = express.Router();

// ─── API Version: v1 ────────────────────────────────────
const v1Router = express.Router();
v1Routes(v1Router);
router.use('/v1', v1Router);

// ─── Future API Versions ────────────────────────────────
// Uncomment and add as new API versions are released:
//
// const v2Routes = require('./api/v2');
// const v2Router = express.Router();
// v2Routes(v2Router);
// router.use('/v2', v2Router);

module.exports = router;
