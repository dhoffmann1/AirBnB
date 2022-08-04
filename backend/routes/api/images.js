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

  if (!user) return res.status(401).json({ message: "Authentication required", statusCode: 401 });
  if (!image) return res.status(404).json({ message:"Image couldn't be found", statusCode: 404 });
  if (image.dataValues.userId !== user.id) return res.status(403).json({ message: 'You do not have permission to delete this image.', statusCode: 403 });

  await image.destroy();
  res.status(200).json({ message: 'Successfully Deleted', statusCode: 200 })
})


module.exports = router;
