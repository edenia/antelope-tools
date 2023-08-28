import { Sequelize } from 'sequelize'

import { hasuraConfig } from '../config'

export const sequelize = new Sequelize(hasuraConfig.databaseURL, {
  dialectOptions: {
    connectTimeout: 60000000
  },
  logging: false
})
