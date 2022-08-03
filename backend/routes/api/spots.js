// backend/routes/api/users.js
const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, Booking, Image, Review, sequelize } = require('../../db/models');
const router = express.Router();

// Get All Spots
router.get('/', async (req, res) => {
  let Spots = await Spot.findAll({
    include: [ { model: Review, attributes: [] } ],
    attributes: { include: [[ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating' ]]},
    group: ['Spot.id']
  });

  for (let spot of Spots) {
    let previewImage = await Image.findOne({
      attributes: ['url'],
      where: {
        previewImage: true,
        spotId: spot.id
      }
    })

    spot.dataValues.previewImage = previewImage !== null ? previewImage.toJSON().url : null;
  }

  if (Spots) {
    res.json({ Spots })
  } else {
    res.json('no spots in database')
  }
});

// Get All Spots belonging to Current User
router.get('/current', restoreUser, async (req, res) => {
  let { user } = req;
  let Spots = await Spot.findAll({
    include: [ { model: Review, attributes: [] } ],
    attributes: { include: [[ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating' ]]},
    group: ['Spot.id'],
    where: { ownerId: user.id }
  });

  for (let spot of Spots) {
    let previewImage = await Image.findOne({
      attributes: ['url'],
      where: {
        previewImage: true,
        spotId: spot.id
      }
    })

    spot.dataValues.previewImage = previewImage !== null ? previewImage.toJSON().url : null;
  }

  if (Spots) {
    res.json({ Spots })
  } else {
    res.json('user has no spots')
  }
});

// Get Details of a Spot from an ID (Lazy Load)
router.get('/:spotId', async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId).then(res => res.toJSON());
  const numReviews = await Review.count({ where: { spotId: req.params.spotId } });
  const avgStarRating = await Review.findOne({
    attributes: [ [ sequelize.fn('AVG', sequelize.col('stars')), 'avgRating' ] ],
    where: { spotId: req.params.spotId }
  })
    .then(res => res.toJSON())
    .then(res2 => res2.avgRating);
  const Images = await Image.findAll({
    attributes: ['id', ['spotId', 'imageableId'], 'url'],
    where: { spotId: req.params.spotId }
  });
  const Owner = await User.findOne({
    attributes: ['id', 'firstName', 'lastName'],
    where: { id: spot.ownerId }
  });

  spot.numReviews = numReviews;
  spot.avgStarRating = avgStarRating;
  spot.Images = Images;
  spot.Owner = Owner;

  if (spot) {
    res.json(spot)
  } else {
    res.json('spot does not exist')
  }
});

// Create a Spot




module.exports = router;
