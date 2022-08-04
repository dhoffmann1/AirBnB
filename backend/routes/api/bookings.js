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

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });

  let Bookings = await Booking.findAll({ where: { userId: user.id }, raw: true });
  let response = [];

  if (!Bookings.length) return res.status(404).json({ message: "User has no bookings", statusCode: 404 })

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

  res.status(200).json({ Bookings: response })
});

// Edit a Booking
router.put('/:bookingId', restoreUser, async (req, res) => {
  let { user } = req;
  let booking = await Booking.findByPk(req.params.bookingId);
  const { startDate, endDate } = req.body;
  let startDateNum = parseInt(startDate.split('-').join(''));
  let endDateNum = parseInt(endDate.split('-').join(''));

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!booking) return res.status(404).json({ message:"Booking couldn't be found", statusCode: 404 });
  if (booking.dataValues.userId !== user.id) return res.status(403).json({ message: 'You do not have permission to edit this booking.', statusCode: 403 })
  if (endDateNum <= startDateNum) return res.status(400).json({ message:"Validation error", statusCode: 400, errors: { endDate: "endDate cannot be on or before startDate" }});
  if (booking.dataValues.startDate <= new Date()) return res.status(403).json({ message: "Past bookings can't be modified", statusCode: 403 })

  // Check that new booking does not interfere with current bookings for spot
  let Bookings = await Booking.findAll({ where: { spotId: booking.dataValues.spotId }, raw: true });
  for (let booking_ of Bookings) {
    let bookingStartDate = parseInt(booking_.startDate.slice(0, 11).split('-').join(''));
    let bookingEndDate = parseInt(booking_.endDate.slice(0, 11).split('-').join(''));

    for (let i = bookingStartDate; i <= bookingEndDate; i++) {
      if (startDateNum === i || endDateNum === i) {
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
  }

  booking.update({
    spotId: booking.spotId,
    userId: booking.userId,
    startDate,
    endDate
  })

  res.json(booking)
});

// Delete a Booking
router.delete('/:bookingId', restoreUser, async (req, res) => {
  const { user } = req;
  let booking = await Booking.findByPk(req.params.bookingId);

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!booking) return res.status(404).json({ message:"Booking couldn't be found", statusCode: 404 });
  if (booking.dataValues.startDate <= new Date()) return res.status(403).json({ message: "Bookings that have been started can't be deleted", statusCode: 403 })

  let spot = await Spot.findOne({ where: { id: booking.spotId }, raw: true });
  if (booking.dataValues.userId !== user.id && spot.ownerId !== user.id) return res.status(403).json({ message: 'You do not have permission to delete this booking.', statusCode: 403 })

  await booking.destroy();
  res.json({ message: 'Successfully Deleted', statusCode: 200 })
})


module.exports = router;
