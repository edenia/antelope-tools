import { Server } from '@hapi/hapi'
import Joi from 'joi'

import { historyPayloadModel } from '../models'
import { getTokenHistory } from '../services/token-history.service'

export const routes = (server: Server) => {
  server.route({
    method: 'POST',
    path: '/evm-token-history',
    handler: ({
      payload: { input }
    }: historyPayloadModel.interfaces.HistoryQuery) =>
      getTokenHistory(input?.range),
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
