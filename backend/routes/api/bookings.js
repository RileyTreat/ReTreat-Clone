const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, ReviewImage, Booking, Review, Spot, SpotImage } = require('../../db/models');
const {Op} = require('sequelize')

const router = express.Router();

router.get('/current', requireAuth, async(req, res, err) => {
    try{
        const { Booking, User} = req.body
        const bookings = await Booking.findAll({
            where: {UserId: req.userId},
            include:{
                model: Spot
            }
        })
        res.json()
    } catch(err){
        next(err)
    }

})

module.exports = router;
