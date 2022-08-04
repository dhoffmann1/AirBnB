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
  let { page, size } = req.query;

  if (!page) page = 1;
  if (!size) size = 20;

  page = parseInt(page);
  size = parseInt(size);

  const pagination = {};

  if (page >= 1 && size >= 1) {
      pagination.limit = size;
      pagination.offset = size * (page - 1);
  } else {
    res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        page: "Page must be greater than or equal to 0",
        size: "Size must be greater than or equal to 0"
      }
    })
  }

  let Spots = await Spot.findAll({ raw: true, ...pagination });

  if (!Spots.length) return res.status(404).json({ message: "There are no spots in the database or on this page" , statusCode: 404})

  for (let spot of Spots) {

    let avgRating = await Review.findOne({
      attributes: [ [ sequelize.fn('AVG', sequelize.col('stars')), 'avgRating' ] ],
      where: { spotId: spot.id },
      raw: true
    })
      .then(res2 => res2.avgRating);

    let previewImage = await Image.findOne({
      attributes: ['url'],
      where: {
        previewImage: true,
        spotId: spot.id
      },
      raw: true
    })

    spot.avgRating = avgRating;
    spot.previewImage = previewImage !== null ? previewImage.url : null;
  }

  res.status(200).json({ Spots, page, size })
});

// Get All Spots belonging to Current User
router.get('/current', restoreUser, async (req, res) => {
  let { user } = req;

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 })

  let Spots = await Spot.findAll({
    include: [ { model: Review, attributes: [] } ],
    attributes: { include: [[ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating' ]]},
    group: ['Spot.id'],
    where: { ownerId: user.id },
    raw: true
  });

  if (!Spots.length) return res.status(404).json({ message: "There are no spots belonging to this User" , statusCode: 404})

  for (let spot of Spots) {
    let previewImage = await Image.findOne({
      attributes: ['url'],
      where: {
        previewImage: true,
        spotId: spot.id
      }
    })

    spot.previewImage = previewImage !== null ? previewImage.url : null;
  }

  res.status(200).json({ Spots })
});

// Get Details of a Spot from an ID (Lazy Load)
router.get('/:spotId', async (req, res) => {
  let spot = await Spot.findOne({ where: {id: req.params.spotId}, raw: true });

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found", statusCode: 404 })

  const numReviews = await Review.count({ where: { spotId: req.params.spotId } });

  const avgStarRating = await Review.findOne({
    attributes: [ [ sequelize.fn('AVG', sequelize.col('stars')), 'avgRating' ] ],
    where: { spotId: req.params.spotId },
    raw: true
  })
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

  return res.status(200).json(spot)
});

// Create a Spot
router.post('/', restoreUser, async (req, res) => {
  const { user } = req

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 })

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

  res.status(201).json(result)
})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', restoreUser, async (req, res) => {
  const { url, previewImage } = req.body;
  const { user } = req;
  let spot = await Spot.findOne({ where: {id: req.params.spotId}, raw: true });

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!spot) return res.status(404).json({ message:"Spot couldn't be found", statusCode: 404 });
  if (spot.ownerId !== user.id) return res.status(403).json({ message: 'You do not have permission to post images on this spot.', statusCode: 403 })

  let newImage = await Image.create({
    url,
    previewImage,
    spotId: spot.id,
    userId: user.id
  });

  let response = {
    id: newImage.id,
    imageableId: newImage.spotId,
    url: newImage.url
  }
  res.status(200).json(response)
})

// Edit a Spot
router.put('/:spotId', restoreUser, async (req, res) => {
  const { user } = req;
  let spot = await Spot.findOne({ where: {id: req.params.spotId}, raw: false });

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!spot) return res.status(404).json({ message:"Spot couldn't be found", statusCode: 404 });
  if (spot.dataValues.ownerId !== user.id) return res.status(403).json({ message: 'You do not have permission to edit this spot.', statusCode: 403 })

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

  res.status(200).json(spot)
})

// Delete a Spot
router.delete('/:spotId', restoreUser, async (req, res) => {
  const { user } = req;
  let spot = await Spot.findOne({ where: {id: req.params.spotId}, raw: false });

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!spot) return res.status(404).json({ message:"Spot couldn't be found", statusCode: 404 });
  if (spot.dataValues.ownerId !== user.id) return res.status(403).json({ message: 'You do not have permission to delete this spot.', statusCode: 403 })


  await spot.destroy();
  res.status(200).json({ message: 'Successfully Deleted', statusCode: 200 })
})

// Get all Reviews by a Spot's ID (Lazy Load)
router.get('/:spotId/reviews', async (req, res) => {
  let spot = await Spot.findOne({ where: {id: req.params.spotId}, raw: true });

  let Reviews = await Review.findAll({
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: Image, attributes: ['id', ['reviewId', 'imageableId'], 'url'] }
   ],
    where: { spotId: req.params.spotId }
  });

  if (!spot) return res.status(404).json({ message:"Spot couldn't be found", statusCode: 404 });
  if (!Reviews.length) return res.status(404).json({ message:"There are no reviews for this spot", statusCode: 404 });

  res.status(200).json({ Reviews })
});

// Create a Review for a Spot based on the Spot's ID
router.post('/:spotId/reviews', restoreUser, async (req, res) => {
  let { user } = req;
  let spot = await Spot.findOne({ where: { id: req.params.spotId }, raw: true });
  let userReviews = await Review.findAll({ where: { userId: user.id, spotId: req.params.spotId }, raw: true });
  const { review, stars } = req.body;

  if (!review.length || stars !== parseInt(stars) || stars < 1 || stars > 5) return res.status(400).json({ message:"Validation error", statusCode: 400, errors: { review: "Review text is required", stars: "Stars must be an integer from 1 to 5" }});
  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!spot) return res.status(404).json({ message:"Spot couldn't be found", statusCode: 404 });
  if (userReviews.length) return res.status(403).json({ message:"User already has a review for this spot", statusCode: 403 })

  let newReview = await Review.create({
    review,
    stars,
    userId: user.id,
    spotId: spot.id
  })

  res.status(201).json(newReview)
});

// Get all Bookings for a Spot based on the Spot's ID (Lazy Load)
router.get('/:spotId/bookings', restoreUser, async (req, res) => {
  const { user } = req;
  let spot = await Spot.findOne({ where: {id: req.params.spotId}, raw: true });
  let Bookings = await Booking.findAll({ where: { spotId: req.params.spotId }, raw: true });
  let response = [];

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!spot) return res.status(404).json({ message:"Spot couldn't be found", statusCode: 404 });
  if (!Bookings.length) return res.status(404).json({ message: "Spot has no bookings", statusCode: 404 })


  if (spot.ownerId === user.id) {
    for (let booking of Bookings) {
      let user = await User.findOne({
        attributes: { include: ['id', 'firstName', 'lastName'] },
        where: { id: booking.userId },
        raw: true
      })

      const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } = booking;

      response.push({
        User: user,
        id,
        spotId,
        userId,
        startDate,
        endDate,
        createdAt,
        updatedAt
      })
    }
  } else {
    for (let booking of Bookings) {

      const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } = booking;

      response.push({
        spotId,
        startDate,
        endDate
      })
    }
  }

  res.status(200).json({ Bookings: response })
});

// Create a Booking for a Spot based on the Spot's ID
router.post('/:spotId/bookings', restoreUser, async (req, res) => {
  let { user } = req;
  let spot = await Spot.findOne({ where: {id: req.params.spotId}, raw: true });
  let Bookings = await Booking.findAll({ where: { spotId: req.params.spotId }, raw: true });
  const { startDate, endDate } = req.body;

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!spot) return res.status(404).json({ message:"Spot couldn't be found", statusCode: 404 });
  if (endDate <= startDate) return res.status(400).json({ message:"Validation error", statusCode: 400, errors: { endDate: "endDate cannot be on or before startDate" }});

  // Check that new booking does not interfere with current bookings for spot
  for (let booking of Bookings) {
    if (startDate <= booking.endDate && endDate >= booking.startDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      })
    }
  }

  let newBooking = await Booking.create({
    spotId: spot.id,
    userId: user.id,
    startDate,
    endDate
  })

  res.status(201).json(newBooking)
});



module.exports = router;
