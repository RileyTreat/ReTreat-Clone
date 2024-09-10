'use strict';
const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "Wonderful Alaskan get away in the woods, with moutain views.",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Can't beat walks in the vineyard with a glass of wine in hand!",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 3,
        review: "Perfect spot to attend a show at the closest venue!",
        stars: 5,
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
