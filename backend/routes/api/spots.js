const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ReviewImage, Booking, Review, Spot, SpotImage } = require('../../db/models');
const {Op} = require('sequelize')

const router = express.Router();

//GET all Spots
// router.get('/', async (req,res, err) => {
//     const spots = await Spot.findAll({
//         include:[
//         {
//             model: Review,
//             attributes: ['stars']
//         },{
//             model: SpotImage,
//             attributes: ['url', 'preview']
//         }
//     ]
//     })

//     let spotsList = [];

//     // Push each spot into spotsList
//     spots.forEach((spot) => {
//         spotsList.push(spot.toJSON());
//     });

//     const formattedSpots = spotsList.map((spot) => {
//         // Calculate average rating
//         let totalStars = 0;
//         let reviewCount = 0;
//         spot.Reviews.forEach((review) => {
//             totalStars += review.stars;
//             reviewCount++;
//         });

//         if (reviewCount > 0) {
//             spot.avgRating = parseFloat((totalStars / reviewCount).toFixed(1));
//         } else {
//             spot.avgRating = null;
//         }
//         delete spot.Reviews; // Remove Reviews after processing avgRating

//         // Calculate preview image
//         spot.SpotImages.forEach((image) => {
//             if (image.preview === true) {
//                 spot.previewImage = image.url;
//             }
//         });
//         if (!spot.previewImage) {
//             spot.previewImage = 'No preview image available';
//         }
//         delete spot.SpotImages; // Remove SpotImages after processing previewImage

//         return spot;
//     })
//     res.json({ Spots: formattedSpots }); 
// })

// GET all spots filtered with query parameters
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    // Convert query parameters to proper types
    page = parseInt(page) || 1;  // Default to 1 if invalid or not provided
    size = parseInt(size) || 20;  // Default to 20 if invalid or not provided
    minLat = minLat !== undefined ? parseFloat(minLat) : undefined;
    maxLat = maxLat !== undefined ? parseFloat(maxLat) : undefined;
    minLng = minLng !== undefined ? parseFloat(minLng) : undefined;
    maxLng = maxLng !== undefined ? parseFloat(maxLng) : undefined;
    minPrice = minPrice !== undefined ? parseFloat(minPrice) : undefined;
    maxPrice = maxPrice !== undefined ? parseFloat(maxPrice) : undefined

    // Validation
    const errors = {};
    if (isNaN(page) || page < 1) errors.page = "Page must be greater than or equal to 1";
    if (isNaN(size) || size < 1 || size > 20) errors.size = "Size must be between 1 and 20";
    if (minLat !== undefined && (isNaN(minLat) || minLat < -90 || minLat > 90)) errors.minLat = "Minimum latitude is invalid";
    if (maxLat !== undefined && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) errors.maxLat = "Maximum latitude is invalid";
    if (minLng !== undefined && (isNaN(minLng) || minLng < -180 || minLng > 180)) errors.minLng = "Minimum longitude is invalid";
    if (maxLng !== undefined && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) errors.maxLng = "Maximum longitude is invalid";
    if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

    // If there are errors, respond with a 400 status
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }

    const spots = await Spot.findAll({
        where: {
            lat: { [Op.between]: [minLat || -90, maxLat || 90] },
            lng: { [Op.between]: [minLng || -180, maxLng || 180] },
            price: { [Op.between]: [minPrice || 0, maxPrice || Number.MAX_SAFE_INTEGER] }
        },
        limit: size,
        offset: (page - 1) * size,
        include: [
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            },
            {
                model: Review,
                attributes: ['stars'],
                required: false
            }
        ]
    });

    let spotsList = spots.map(spot => spot.toJSON());

    // Process each spot to include avgRating and previewImage
    spotsList.forEach(spot => {
        // Calculate average rating
        let totalStars = 0;
        let reviewCount = 0;
        spot.Reviews.forEach(review => {
            totalStars += review.stars;
            reviewCount++;
        });

        if (reviewCount > 0) {
            spot.avgRating = parseFloat((totalStars / reviewCount).toFixed(1));
        } else {
            spot.avgRating = null;
        }
        delete spot.Reviews; // Remove Reviews after processing avgRating

        // Calculate preview image
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url;
            }
        });
        if (!spot.previewImage) {
            spot.previewImage = 'No preview image available';
        }
        delete spot.SpotImages; // Remove SpotImages after processing previewImage

        return spot;
    });

    res.json({ Spots: spotsList, page, size });
});



//GET all SPots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where: {ownerId: userId},
        include: [
            {
                model: Review,
                attributes: ['stars'],
                required: false 
            },
            {
                model: SpotImage,
                attributes: ['url', 'preview'],
                required: false 
            },
        ],
    })

    let spotsList = []

    spots.forEach((spot) => {
        spotsList.push(spot.toJSON())
    })

    const formattedSpots= spotsList.map((spot) => {
        spot.SpotImages.forEach((image) => {
            if(image.preview === true){
                spot.previewImage = image.url
            }
        })
        if(!spot.previewImage){
            spot.previewImage = 'No preview image available'
        }
        delete spot.SpotImages

        let totalStars = 0;
        let reviewCount = 0;
        spot.Reviews.forEach((review) => {
            totalStars += review.stars;
            reviewCount++;
        })
    
        if(reviewCount > 0){
            spot.avgRating = parseFloat((totalStars / reviewCount).toFixed(1));;
        } else {
            spot.avgRating = null
        }
        delete spot.Reviews
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.avgRating,
            previewImage: spot.previewImage
        };
    })
    res.json({Spots: formattedSpots})

})

//POST Create a Spot
router.post('/', requireAuth, async (req, res, next) =>{
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const createSpot = await Spot.create({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        res.status(201).json(createSpot);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = {};

            for (let err of error.errors) {
                if (err.path === 'address') errors.address = "Street address is required";
                if (err.path === 'city') errors.city = "City is required";
                if (err.path === 'state') errors.state = "State is required";
                if (err.path === 'country') errors.country = "Country is required";
                if (err.path === 'lat') errors.lat = "Latitude must be within -90 and 90";
                if (err.path === 'lng') errors.lng = "Longitude must be within -180 and 180";
                if (err.path === 'name') errors.name = "Name must be less than 50 characters";
                if (err.path === 'description') errors.description = "Description is required";
                if (err.path === 'price') errors.price = "Price per day must be a positive number";
            }

            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        next(error);
    }
});

//GET details of a Spot from an id
router.get('/:spotId', async (req, res)=> {
    const {spotId } = req.params;

    const spot = await Spot.findOne({
        where : {id: spotId},
        include: [
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: SpotImage ,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: Review,
                attributes: ['stars']
            },
        ]
    })
    if(!spot){
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    const spotDetails = spot.toJSON()

    let totalStars = 0;
    let reviewCount = 0;

    spotDetails.Reviews.forEach((review) => {
        totalStars += review.stars;
        reviewCount++;
    })

    spotDetails.avgStarRating = reviewCount > 0 ? parseFloat((totalStars / reviewCount).toFixed(1)) : null;
    spotDetails.numReviews = reviewCount;

    spotDetails.ownerId = spotDetails.Owner.id;

    const formattedSpotImages = spotDetails.SpotImages.map(image => {
        return {
            id: image.id,
            url: image.url,
            preview: image.preview
        };
    });

    const formattedResponse = {
        id: spotDetails.id,
        ownerId: spotDetails.ownerId,
        address: spotDetails.address,
        city: spotDetails.city,
        state: spotDetails.state,
        country: spotDetails.country,
        lat: spotDetails.lat,
        lng: spotDetails.lng,
        name: spotDetails.name,
        description: spotDetails.description,
        price: spotDetails.price,
        createdAt: spotDetails.createdAt,
        updatedAt: spotDetails.updatedAt,
        numReviews: spotDetails.numReviews,
        avgStarRating: spotDetails.avgStarRating,
        SpotImages: formattedSpotImages,
        Owner: {
            id: spotDetails.Owner.id,
            firstName: spotDetails.Owner.firstName,
            lastName: spotDetails.Owner.lastName
        }
    };
    res.status(200).json(formattedResponse);
})


//POST add an Image to a SPot based on the Spots id
router.post('/:spotId/images', requireAuth, async (req, res) =>{
    const {spotId} = req.params;
    const { url, preview} = req.body
    const userId = req.user.id;

    try{
        const spot = await Spot.findByPk(spotId)
        // const spot = await Spot.findOne({
        //     where: {
        //         id: spotId,
        //         ownerId: userId
        //     }
        // })

        if(!spot){
            return res.status(404).json({message: "Spot couldn't be found"})
        }
        // Check if the current user is the owner of the spot
        if (spot.ownerId !== userId) {
            return res.status(403).json({
                message: "Forbidden: You do not have permission to add images to this spot"
            });
        }

        const newImage = await SpotImage.create({
            spotId: spot.id,
            url,
            preview
        })

        formattedImage = {
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        }
        res.status(201).json(formattedImage)
    }catch(err) {
        return res.status(500).json({
            message: 'Failed to add image',
            error: err.message
        })
    }
})

//GET all the reviews by a spots id
router.get('/:spotId/reviews', async (req, res) =>{
    const { spotId } = req.params;

    // Find the spot with the given spotId
    const spot = await Spot.findOne({
        where: { id: spotId },
        include: [
            {
                model: Review,
                attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    },
                    {
                        model: ReviewImage,
                        attributes: ['id', 'url']
                    }
                ]
            }
        ]
    });

    // If spot is not found, return a 404 error
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    const reviews = spot.Reviews.map(review => {
        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
                id: review.User.id,
                firstName: review.User.firstName,
                lastName: review.User.lastName
            },
            ReviewImages: review.ReviewImages.map(image => ({
                id: image.id,
                url: image.url
            }))
        };
    });

    res.status(200).json({
        Reviews: reviews
    });
})

//POST create a review for a spot based on the spots id
router.post('/:spotId/reviews', requireAuth, async (req,res) =>{
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    try {
        // Find the spot by spotId and check if it exists
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Check if the current user already has a review for the spot
        const existingReview = await Review.findOne({
            where: { spotId, userId }
        });

        if (existingReview) {
            return res.status(500).json({
                message: "User already has a review for this spot"
            });
        }

        // Validate the review and stars input
        const errors = {};
        if (!review || review.trim() === '') {
            errors.review = "Review text is required";
        }
        if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
            errors.stars = "Stars must be an integer from 1 to 5";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        // Create the review
        const newReview = await Review.create({
            spotId,
            userId,
            review,
            stars
        });

        res.status(201).json(newReview);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
})

//GET all bookings for a spot based on the spots id
router.get('/:spotId/bookings', requireAuth, async (req, res)=>{
    const { spotId } = req.params;
    const userId = req.user.id;

    // Find the spot with the given spotId
    const spot = await Spot.findOne({
        where: { id: spotId },
        include: [
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Booking,
                attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            }
        ]
    });

    // If spot is not found, return a 404 error
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    const isOwner = spot.Owner.id === userId;
    const bookings = spot.Bookings.map(booking => {
        // Format the startDate and endDate to only return YYYY-MM-DD
        const formattedStartDate = booking.startDate.toISOString().split('T')[0];
        const formattedEndDate = booking.endDate.toISOString().split('T')[0];

        if (isOwner) {
            return {
                User: {
                    id: booking.User.id,
                    firstName: booking.User.firstName,
                    lastName: booking.User.lastName
                },
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            };
        } else {
            return {
                spotId: spot.id,
                startDate: formattedStartDate,
                endDate: formattedEndDate
             };
        }
    });

    res.status(200).json({
        Bookings: bookings
    });
})

//POST create and retun a new booking from spot specified by id
router.post('/:spotId/bookings', requireAuth, async (req,res)=>{
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    try {
        // Find the spot by spotId and check if it exists
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Check if the spot belongs to the current user (authorization)
        if (spot.ownerId === userId) {
            return res.status(403).json({
                message: "Forbidden: You cannot book your own spot"
            });
        }

        // // Check if startDate or endDate are valid
        // const errors = {};
        // const today = new Date();

        // if (new Date(startDate) < today) {
        //     errors.startDate = "startDate cannot be in the past";
        // }
        // if (new Date(endDate) <= new Date(startDate)) {
        //     errors.endDate = "endDate cannot be on or before startDate";
        // }
     // Parse the dates from the request and today
     const today = new Date();
     const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

     const startDateObj = new Date(startDate);
     const endDateObj = new Date(endDate);

     // Strip the time component from the received dates
     const startDateOnly = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), startDateObj.getDate());
     const endDateOnly = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), endDateObj.getDate());

     // Validate the new startDate and endDate
     const errors = {};

     if (startDateOnly < todayDateOnly) {
         errors.startDate = "startDate cannot be in the past";
     }
     if (endDateOnly <= startDateOnly) {
         errors.endDate = "endDate cannot be on or before startDate";
     }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        // Check for booking conflicts
        const conflictingBookings = await Booking.findAll({
            where: {
                spotId,
                [Op.or]: [
                    {
                        startDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: startDate } },
                            { endDate: { [Op.gte]: endDate } }
                        ]
                    }
                ]
            }
        });

        if (conflictingBookings.length > 0) {
            return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            });
        }

        // Create the booking
        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate
        });
           // Format the startDate and endDate to remove the time component
           const formattedBooking = {
            ...newBooking.toJSON(),
            startDate: new Date(newBooking.startDate).toISOString().slice(0, 10),
            endDate: new Date(newBooking.endDate).toISOString().slice(0, 10),
        };


        res.status(201).json(formattedBooking);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
})

//PUT edit a spot
router.put('/:spotId', requireAuth, async (req, res)=>{
    const {spotId} = req.params;
    const{ address, city, state, country, lat, lng, name, description, price} = req.body

    try{
        const spot = await Spot.findByPk(spotId)

        if(!spot){ return res.status(404).json({message: "Spot couldnt be found"})}

        if(spot.ownerId !== req.user.id){ return res.status(403).json({message: 'Forbidden'})}

        await spot.update({
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

        res.status(200).json(spot)
    } catch(error){
        if(error.name === 'SequelizeValidationError'){
            const errors ={}

            for (let err of error.errors) {
                if (err.path === 'address') errors.address = "Street address is required";
                if (err.path === 'city') errors.city = "City is required";
                if (err.path === 'state') errors.state = "State is required";
                if (err.path === 'country') errors.country = "Country is required";
                if (err.path === 'lat') errors.lat = "Latitude must be within -90 and 90";
                if (err.path === 'lng') errors.lng = "Longitude must be within -180 and 180";
                if (err.path === 'name') errors.name = "Name must be less than 50 characters";
                if (err.path === 'description') errors.description = "Description is required";
                if (err.path === 'price') errors.price = "Price per day must be a positive number";
              }
        
              return res.status(400).json({
                message: "Bad Request",
                errors
        
        })
    }
    next(error)
}
})

// DELETE a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {return res.status(404).json({ message: "Spot couldn't be found" });}

        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to delete this spot" });
        }

        if (spot.ownerId !== userId) {return res.status(403).json({ message: "Forbidden" });}

        await spot.destroy();

        return res.status(200).json({ message: "Successfully deleted" });

    } catch (err) {
        return res.status(500).json({
            message: "Did not delete spot",
            error: err.message
        });
    }
});

module.exports = router;
