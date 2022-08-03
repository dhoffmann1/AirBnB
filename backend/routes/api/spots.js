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
  }

  let Spots = await Spot.findAll({
    // include: [ { model: Review, attributes: [] } ],
    // attributes: { include: [[ sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating' ]]},
    // group: ['Spot.id'],
    raw: true,
    ...pagination
  });

  for (let spot of Spots) {

    let avgRating = await Review.findOne({
      attributes: [ [ sequelize.fn('AVG', sequelize.col('stars')), 'avgRating' ] ],
      where: { spotId: spot.id },
      raw: true
    })
      // .then(res => res.toJSON())  // { avgRating: 4.5 }
      .then(res2 => res2.avgRating);

    let previewImage = await Image.findOne({  // If it has a preview = { url: 'example.com' } OR no PImg = null
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

  if (Spots.length) {
    res.json({ Spots, page, size })
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
    where: { ownerId: user.id },
    raw: true
  });

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
    where: { spotId: req.params.spotId },
    raw: true
  })
    // .then(res => res.toJSON())  // { avgRating: 4.5 }
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
  const { url, previewImage } = req.body;
  const { user } = req;
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot) {
    if (spot.dataValues.ownerId === user.id) {
      let newImage = await Image.create({
        url,
        previewImage,
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

// Get all Bookings for a Spot based on the Spot's ID (Lazy Load)
router.get('/:spotId/bookings', restoreUser, async (req, res) => {
  const { user } = req;
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot) {
    let Bookings = await Booking.findAll({ where: { spotId: spot.id }, raw: true });
    let response = [];

    if (spot.dataValues.ownerId === user.id) {
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


    if (response.length) {
      res.json({ Bookings: response })
    } else {
      res.json("No bookings for this spot")
    }

  } else {
      res.json({ message:"Spot couldn't be found" })
  }
});

// Create a Booking for a Spot based on the Spot's ID
router.post('/:spotId/bookings', restoreUser, async (req, res) => {
  let { user } = req;
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot) {
    const { startDate, endDate } = req.body;

    let newBooking = await Booking.create({
      spotId: spot.id,
      userId: user.id,
      startDate,
      endDate
    })

    res.json(newBooking)
  } else {
    res.json({ message:"Spot couldn't be found", statusCode: 404 })
  }
});



module.exports = router;
