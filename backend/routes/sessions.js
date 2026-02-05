const express = require('express');
const router = express.Router();
const { getSessions, createSession } = require('../controllers/sessionsController');

// GET /sessions - Retrieve milking sessions with pagination
router.get('/', getSessions);
// POST /sessions - Save milking session details
router.post('/', createSession);

module.exports = router;
