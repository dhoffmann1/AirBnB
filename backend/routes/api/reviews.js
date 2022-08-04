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

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });

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

  if (!Reviews.length) return res.status(404).json({ message:"Current user has no reviews", statusCode: 404 });

  res.status(200).json({ Reviews })
});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', restoreUser, async (req, res) => {
  const { url, previewImage } = req.body;
  const { user } = req;
  let review = await Review.findOne({ where: {id: req.params.reviewId}, raw: true })
  let reviewImages = await Image.findAll({ where: {reviewId: req.params.reviewId}, raw: true });

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!review) return res.status(404).json({ message:"Review couldn't be found", statusCode: 404 });
  if (review.userId !== user.id) return res.status(403).json({ message: 'You do not have permission to add an image to this review.', statusCode: 403 });
  if (reviewImages.length >= 10) return res.status(403).json({ message: "Maximum number of images for this resource was reached", statusCode: 403 });


  let newImage = await Image.create({
    url,
    previewImage,
    reviewId: review.id,
    userId: user.id
  });

  let response = {
    id: newImage.id,
    imageableId: newImage.reviewId,
    url: newImage.url
  }

  res.status(200).json(response)
})


// Edit a Review
router.put('/:reviewId', restoreUser, async (req, res) => {
  let { user } = req;
  let review_ = await Review.findOne({ where: {id: req.params.reviewId}, raw: false });
  const { review, stars } = req.body;

  if (!review.length || stars !== parseInt(stars) || stars < 1 || stars > 5) return res.status(400).json({ message:"Validation error", statusCode: 400, errors: { review: "Review text is required", stars: "Stars must be an integer from 1 to 5" }});
  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!review_) return res.status(404).json({ message:"Review couldn't be found", statusCode: 404 });
  if (review_.dataValues.userId !== user.id) return res.status(403).json({ message: 'You do not have permission to edit this review.', statusCode: 403 });

  review_.update({
    review,
    stars,
    userId: review_.dataValues.userId,
    spotId: review_.dataValues.spotId
  })

  res.status(200).json(review_)
});

// Delete a Review
router.delete('/:reviewId', restoreUser, async (req, res) => {
  const { user } = req;
  let review = await Review.findOne({ where: {id: req.params.reviewId}, raw: false });

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!review) return res.status(404).json({ message:"Review couldn't be found", statusCode: 404 });
  if (review.dataValues.userId !== user.id) return res.status(403).json({ message: 'You do not have permission to delete this review.', statusCode: 403 });

  await review.destroy();
  res.status(200).json({ message: 'Successfully Deleted', statusCode: 200 });
});


module.exports = router;
