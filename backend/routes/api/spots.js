// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, Booking, Image, Review, sequelize } = require('../../db/models');
const router = express.Router();

// Get All Spots
router.get('/', async (req, res) => {
  let Spots = await Spot.findAll({
    include: [
      { model: Review, attributes: [] },
      { model: Image, attributes: [], where: {previewImage:true} }
    ],
    attributes: {
      include: [
        [ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating' ],
        [ sequelize.literal('Images.url'), 'previewImage' ]
      ]
    },
    group: ['Spot.id']
  });

  if (Spots) {
    res.json({ Spots })
  } else {
    res.json('no spots in database')
  }
})



module.exports = router;
