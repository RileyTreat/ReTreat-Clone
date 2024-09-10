'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "1 Main Street",
        city: "Wasilla",
        state: "Alaska",
        country: "USA",
        lat: 11.11111,
        lng: -11.11111,
        name: "Lake Cabin",
        description: "Beautiful secluded lake cabin.",
        price: 100
      },
      {
        ownerId: 2,
        address: "2 Dove Drive",
        city: "Sonoma",
        state: "California",
        country: "USA",
        lat: 22.2222,
        lng: -22.2222,
        name: "Winery Getaway",
        description: "Gorgeous getaway hiden umong the grapes.",
        price: 102
      },
      {
        ownerId: 3,
        address: "3 Lovely Lane",
        city: "Denver",
        state: "Colorado",
        country: "USA",
        lat: 33.3333,
        lng: -33.3333,
        name: "Downtown Hidden Gem",
        description: "Lovely view of the city next to multiple venues.",
        price: 103
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
