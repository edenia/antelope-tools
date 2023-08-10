import { Server } from '@hapi/hapi'
import Joi from 'joi'

import { historyPayloadModel } from '../models'
import { getTransactions } from '../services/transactions.service'

export const routes = (server: Server) => {
  server.route({
    method: 'POST',
    path: '/evm-transactions-history',
    handler: ({
      payload: { input }
    }: historyPayloadModel.interfaces.HistoryQuery) =>
      getTransactions(input?.range),
    options: {
      validate: {
        payload: Joi.object({
          input: Joi.object({
            range: Joi.string().required()
          }).required()
        }).options({ stripUnknown: true })
      },
      auth: false
    }
  })
}
