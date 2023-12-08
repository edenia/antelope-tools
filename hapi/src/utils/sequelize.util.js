const { Sequelize } = require('sequelize')

const { hasuraConfig } = require('../config')

const sequelize = new Sequelize(hasuraConfig.databaseUrl, {
  dialectOptions: {
    connectTimeout: 60000000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})

module.exports = sequelize
