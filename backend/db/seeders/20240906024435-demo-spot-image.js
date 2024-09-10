'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://cdn.pixabay.com/photo/2024/04/14/03/15/ai-generated-8694734_1280.jpg',
        preview: true,

      },
      {
        spotId: 2,
        url: 'https://cdn.pixabay.com/photo/2024/05/24/15/52/wine-8785341_1280.jpg',
        preview: true,

      },
      {
        spotId: 3,
        url: 'https://cdn.pixabay.com/photo/2024/05/10/10/13/ai-generated-8752761_1280.jpg',
        preview: true,
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
