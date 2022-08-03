const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, Booking, Image, Review, sequelize } = require('../../db/models');
const router = express.Router();

// Delete an Image
router.delete('/:imageId', restoreUser, async (req, res) => {
  const { user } = req;
  let image = await Image.findByPk(req.params.imageId);
  if (image) {
    if (image.dataValues.userId === user.id) {
      await image.destroy();
      res.json({ message: 'Successfully Deleted', statusCode: 200 })
    } else {
      res.json({ message: 'You do not have permission to delete this image.' })
    }
  } else {
    res.json({ message:"Image couldn't be found", statusCode: 404 })
  }
})


module.exports = router;
