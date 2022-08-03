const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, Booking, Image, Review, sequelize } = require('../../db/models');
const router = express.Router();

// Get All Bookings belonging to Current User
router.get('/current', restoreUser, async (req, res) => {
  let { user } = req;
  let Bookings = await Booking.findAll({ where: { userId: user.id }, raw: true });
  let response = [];

  for (let booking of Bookings) {
    let spot = await Spot.findOne({
      attributes: { exclude: ['description', 'createdAt', 'updatedAt'] },
      where: { id: booking.spotId },
      raw: true
    })


    let previewImage = await Image.findOne({
      attributes: ['url'],
      where: {
        previewImage: true,
        spotId: spot.id
      },
      raw: true
    })

    spot.previewImage = previewImage !== null ? previewImage.url : null;

    const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } = booking;

    response.push({
      id,
      spotId,
      Spot: spot,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt
    })
  }

  if (response.length) {
    res.json({ Bookings: response })
  } else {
    res.json('user has no bookings')
  }
});

// Edit a Booking
router.put('/:bookingId', restoreUser, async (req, res) => {
  let { user } = req;
  let booking = await Booking.findByPk(req.params.bookingId)
  if (booking) {
    if (booking.dataValues.userId === user.id) {
      const { startDate, endDate } = req.body;

      booking.update({
        spotId: booking.spotId,
        userId: booking.userId,
        startDate,
        endDate
      })

      res.json(booking)
    } else {
      res.json('You do not have permission')
    }
  } else {
    res.json({ message:"Booking couldn't be found", statusCode: 404 })
  }
});

// Delete a Booking
router.delete('/:bookingId', restoreUser, async (req, res) => {
  const { user } = req;
  let booking = await Booking.findByPk(req.params.bookingId)
  if (booking) {
    if (booking.dataValues.userId === user.id) {
      await booking.destroy();
      res.json({ message: 'Successfully Deleted', statusCode: 200 })
    } else {
      res.json('You do not have permission to delete this booking.')
    }
  } else {
    res.json({ message:"Booking couldn't be found", statusCode: 404 })
  }
})


module.exports = router;
