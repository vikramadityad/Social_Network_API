const express = require('express');
const router = express.Router();
const userRoutes = require('./api/users');
const thoughtRoutes = require('./api/thoughts');

// Configure and mount API routes (e.g., /api/users, /api/thoughts).

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
