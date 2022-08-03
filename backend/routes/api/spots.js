// backend/routes/api/spots.js
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

  if (Spots.length) {
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

  if (Spots.length) {
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
    .then(res => res.toJSON())  // { avgRating: 4.5 }
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
router.post('/', restoreUser, async (req, res) => {
  const { user } = req
  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  } = req.body;

  const newSpot = {
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  };

  let result = await Spot.create(newSpot);

  if (result) {
    res.json(result)
  } else {
    res.json('could not create new spot')
  }

})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', restoreUser, async (req, res) => {
  const { url } = req.body;
  const { user } = req;
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot) {
    if (spot.dataValues.ownerId === user.id) {
      let newImage = await Image.create({
        url,
        spotId: spot.dataValues.id,
        userId: user.id
      });

      let response = {
        id: newImage.id,
        imageableId: newImage.spotId,
        url: newImage.url
      }
      res.json(response)
    } else {
      res.json('You do not have permission to post images on this spot.')
    }
  } else {
      res.json({ message:"Spot couldn't be found" })
  }
})

// Edit a Spot
router.put('/:spotId', restoreUser, async (req, res) => {
  const { user } = req;
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot) {
    if (spot.dataValues.ownerId === user.id) {
      const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      } = req.body;

      spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      })
      res.json(spot)
    } else {
      res.json('You do not have permission to update this spot.')
    }
  } else {
    res.json({ message:"Spot couldn't be found" })
  }
})

// Delete a Spot
router.delete('/:spotId', restoreUser, async (req, res) => {
  const { user } = req;
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot) {
    if (spot.dataValues.ownerId === user.id) {
      await spot.destroy();
      res.json({ message: 'Successfully Deleted', statusCode: 200 })
    } else {
      res.json('You do not have permission to delete this spot.')
    }
  } else {
    res.json({ message:"Spot couldn't be found" })
  }
})


// Get all Reviews from a Spot's ID (Lazy Load)
router.get('/:spotId/reviews', async (req, res) => {
  let Reviews = await Review.findAll({
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: Image, attributes: ['id', ['reviewId', 'imageableId'], 'url'] }
   ],
    group: ['Review.id'],
    where: { spotId: req.params.spotId }
  });

  if (Reviews.length) {
    res.json({ Reviews })
  } else {
    res.json("Spot couldn't be found")
  }
});

// Create a Review for a Spot based on the Spot's ID
router.post('/:spotId/reviews', restoreUser, async (req, res) => {
  let { user } = req;
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot) {
    const { review, stars } = req.body;

    let newReview = await Review.create({
      review,
      stars,
      userId: user.id,
      spotId: spot.id
    })

    res.json(newReview)
  } else {
    res.json({ message:"Spot couldn't be found" })
  }
});

module.exports = router;
