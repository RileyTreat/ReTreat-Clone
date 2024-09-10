const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ReviewImage, Booking, Review, Spot, SpotImage } = require('../../db/models');
const {Op} = require('sequelize')

const router = express.Router();

// DELETE a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    try {
        // Find the spot image by imageId
        const spotImage = await SpotImage.findOne({
            where: { id: imageId },
            include: {
                model: Spot,
                attributes: ['ownerId'] // Include spot owner information
            }
        });

        // If the spot image is not found, return a 404 error
        if (!spotImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found"
            });
        }

        // Ensure the user owns the spot
        if (spotImage.Spot.ownerId !== userId) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to delete this image'
            });
        }

        // Delete the spot image
        await spotImage.destroy();

        res.status(200).json({
            message: "Successfully deleted"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = router;
