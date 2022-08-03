// backend/routes/api/reviews.js
const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, Booking, Image, Review, sequelize } = require('../../db/models');
const router = express.Router();


// Get All Reviews belonging to Current User
router.get('/current', restoreUser, async (req, res) => {
  let { user } = req;
  let Reviews = await Review.findAll({
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'] },
      { model: Image, attributes: ['id', ['reviewId', 'imageableId'], 'url'] },
   ],
    group: ['Review.id'],
    where: { userId: user.id }
  });

  if (Reviews.length) {
    res.json({ Reviews })
  } else {
    res.json('user has no reviews')
  }
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', restoreUser, async (req, res) => {
  const { url } = req.body;
  const { user } = req;
  let review = await Review.findByPk(req.params.reviewId)
  if (review) {
    if (review.dataValues.userId === user.id) {
      let newImage = await Image.create({
        url,
        reviewId: review.dataValues.id,
        userId: user.id
      });

      let response = {
        id: newImage.id,
        imageableId: newImage.reviewId,
        url: newImage.url
      }
      res.json(response)
    } else {
      res.json('You do not have permission to post images on this spot.')
    }
  } else {
      res.json({ message:"Review couldn't be found" })
  }
})


// Edit a Review
router.put('/:reviewId', restoreUser, async (req, res) => {
  let { user } = req;
  let review_ = await Review.findByPk(req.params.reviewId)
  if (review_) {
    if (review_.dataValues.userId === user.id) {
      const { review, stars } = req.body;

      review_.update({
        review,
        stars,
        userId: review.userId,
        spotId: review.spotId
      })

      res.json(review_)
    } else {
      res.json('You do not have permission')
    }
  } else {
    res.json({ message:"Review couldn't be found" })
  }
});

// Delete a Review
router.delete('/:reviewId', restoreUser, async (req, res) => {
  const { user } = req;
  let review = await Review.findByPk(req.params.reviewId)
  if (review) {
    if (review.dataValues.userId === user.id) {
      await review.destroy();
      res.json({ message: 'Successfully Deleted', statusCode: 200 })
    } else {
      res.json('You do not have permission to delete this review.')
    }
  } else {
    res.json({ message:"Review couldn't be found", statusCode: 404 })
  }
})


module.exports = router;
