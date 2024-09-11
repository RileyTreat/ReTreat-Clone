const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ReviewImage, Booking, Review, Spot, SpotImage } = require('../../db/models');
const {Op} = require('sequelize')

const router = express.Router();

//GET all reviews of the current User
router.get('/current', requireAuth, async (req,res)=>{
    const userId = req.user.id;

    // Fetch all reviews written by the current user
    const reviews = await Review.findAll({
        where: { userId: userId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [
                    {
                        model: SpotImage,
                        attributes: ['url', 'preview']
                    }
                ]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    let reviewsList = [];

    reviews.forEach((review) => {
        const reviewJSON = review.toJSON();

        // Handle preview image logic for the Spot
        reviewJSON.Spot.SpotImages.forEach((image) => {
            if (image.preview === true) {
                reviewJSON.Spot.previewImage = image.url;
            }
        });

        // If no preview image was found, set default message
        if (!reviewJSON.Spot.previewImage) {
            reviewJSON.Spot.previewImage = 'No preview image available';
        }

        // Remove SpotImages array from response
        delete reviewJSON.Spot.SpotImages;

        reviewsList.push({
            id: reviewJSON.id,
            userId: reviewJSON.userId,
            spotId: reviewJSON.spotId,
            review: reviewJSON.review,
            stars: reviewJSON.stars,
            createdAt: reviewJSON.createdAt,
            updatedAt: reviewJSON.updatedAt,
            User: {
                id: reviewJSON.User.id,
                firstName: reviewJSON.User.firstName,
                lastName: reviewJSON.User.lastName
            },
            Spot: {
                id: reviewJSON.Spot.id,
                ownerId: reviewJSON.Spot.ownerId,
                address: reviewJSON.Spot.address,
                city: reviewJSON.Spot.city,
                state: reviewJSON.Spot.state,
                country: reviewJSON.Spot.country,
                lat: reviewJSON.Spot.lat,
                lng: reviewJSON.Spot.lng,
                name: reviewJSON.Spot.name,
                price: reviewJSON.Spot.price,
                previewImage: reviewJSON.Spot.previewImage
            },
            ReviewImages: reviewJSON.ReviewImages.map(image => {
                return {
                    id: image.id,
                    url: image.url
                };
            })
        });
    });

    res.status(200).json({ Reviews: reviewsList });
})

//POST create and return a new image for a review specified by  reviews id
router.post('/:reviewId/images', requireAuth, async (req,res)=> {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    try {
        // Find the review by reviewId and check if it belongs to the current user
        const review = await Review.findByPk(reviewId);

        // If the review doesn't exist
        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }
        // check if the current user is the owner of the review
        if (review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to add images to this review" });
        }

        // Check if the review already has 10 images
        const imageCount = await ReviewImage.count({ where: { reviewId } });

        if (imageCount >= 10) {
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached"
            });
        }

        // Create a new review image
        const newImage = await ReviewImage.create({
            reviewId: review.id,
            url
        });

        // Return the newly created image
        const formattedImage = {
            id: newImage.id,
            url: newImage.url
        };

        res.status(201).json(formattedImage);

    } catch (err) {
        return res.status(500).json({
            message: 'Failed to add image',
            error: err.message
        });
    }

})


//PUT update and return an existing review
router.put('/:reviewId', requireAuth, async (req,res)=>{
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    try {
        // Validate the new review and stars
        const errors = {};
        if (!review || review.trim() === "") {
            errors.review = "Review text is required";
        }
        if (!stars || !Number.isInteger(stars) || stars < 1 || stars > 5) {
            errors.stars = "Stars must be an integer from 1 to 5";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        // Find the review by reviewId
        const existingReview = await Review.findByPk(reviewId);

        if (!existingReview) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // Ensure the review belongs to the current user
        if (existingReview.userId !== userId) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to edit this review'
            });
        }

        // Update the review
        await existingReview.update({
            review,
            stars
        });

        res.status(200).json(existingReview);

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }

})

//DELETE a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await review.destroy();

        return res.status(200).json({ message: "Successfully deleted" });

    } catch (err) {
        return res.status(500).json({
            message: "Did not delete review",
            error: err.message
        });
    }
});

module.exports = router;
