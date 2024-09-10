'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-09-09',
        endDate: '2023-1-11',
     
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2026-2-2',
        endDate: '2026-2-12',
       
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2024-3-3',
        endDate: '2024-3-13',
       
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
