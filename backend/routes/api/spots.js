// backend/routes/api/users.js
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, Booking, Image, Review } = require('../../db/models');
const router = express.Router();

// Get All Spots
router.get('/', async (req, res) => {
  
})



module.exports = router;
