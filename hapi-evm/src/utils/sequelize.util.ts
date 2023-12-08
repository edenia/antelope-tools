import { Sequelize } from 'sequelize'

import { hasuraConfig } from '../config'

export const sequelize = new Sequelize(hasuraConfig.databaseURL, {
  dialectOptions: {
    connectTimeout: 60000000
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
})
