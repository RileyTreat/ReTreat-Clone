const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ReviewImage, Booking, Review, Spot, SpotImage } = require('../../db/models');
const {Op} = require('sequelize')

const router = express.Router();

// DELETE a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    try {
        // Find the review image by imageId
        const reviewImage = await ReviewImage.findOne({
            where: { id: imageId },
            include: {
                model: Review,
                attributes: ['userId'] // Include review user information
            }
        });

        // If the review image is not found, return a 404 error
        if (!reviewImage) {
            return res.status(404).json({
                message: "Review Image couldn't be found"
            });
        }

        // Ensure the user owns the review
        if (reviewImage.Review.userId !== userId) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to delete this image'
            });
        }

        // Delete the review image
        await reviewImage.destroy();

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
