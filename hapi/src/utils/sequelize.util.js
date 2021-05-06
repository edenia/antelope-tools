const { Sequelize } = require('sequelize')

const { hasuraConfig } = require('../config')

const sequelize = new Sequelize(hasuraConfig.databaseUrl, {
  dialectOptions: {
    connectTimeout: 60000000
  },
  logging: false
})

module.exports = sequelize
