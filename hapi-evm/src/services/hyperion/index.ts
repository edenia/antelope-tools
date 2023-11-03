import moment, { DurationInputArg2 } from 'moment'

import { hyperionConfig } from '../../config'
import { coreUtil, timeUtil } from '../../utils'
import { hyperionStateModel, defaultModel } from '../../models'

import updaters from './updaters'

interface GetActionsParams {
  after: string
  before: string
  skip: number
  updater: Omit<defaultModel.BuilderListener, 'apply'>
}

interface GetActionsResponse {
  hasMore: boolean
  actions: any[]
}

const TIME_BEFORE_IRREVERSIBILITY = 164

const getLastSyncedAt = async () => {
  const state = await hyperionStateModel.queries.getState()

  if (state) {
    return state.lastSyncedAt
  }

  await hyperionStateModel.queries.saveOrUpdate(hyperionConfig.startAt)

  return hyperionConfig.startAt
}

const getGap = (lastSyncedAt: string) => {
  if (moment().diff(moment(lastSyncedAt), 'days') > 0) {
    return {
      amount: 1,
      unit: 'day'
    }
  }

  if (moment().diff(moment(lastSyncedAt), 'hours') > 0) {
    return {
      amount: 1,
      unit: 'hour'
    }
  }

  if (
    moment().diff(moment(lastSyncedAt), 'seconds') >=
    TIME_BEFORE_IRREVERSIBILITY * 2
  ) {
    return {
      amount: TIME_BEFORE_IRREVERSIBILITY,
      unit: 'seconds'
    }
  }

  if (
    moment().diff(moment(lastSyncedAt), 'seconds') >=
    TIME_BEFORE_IRREVERSIBILITY + 10
  ) {
    return {
      amount: 10,
      unit: 'seconds'
    }
  }

  return {
    amount: 1,
    unit: 'seconds'
  }
}

const getActions = async (
  params: GetActionsParams
): Promise<GetActionsResponse> => {
  const limit = 100
  const { data } = await coreUtil.axios.default.get(
    `${hyperionConfig.api}/v2/history/get_actions`,
    {
      params: {
        ...params,
        account: params.updater.notified_account,
        limit,
        filter: params.updater.type,
        sort: 'asc',
        simple: true,
        checkLib: true
      }
    }
  )

  const notIrreversible = data.simple_actions.find(
    (item: any) => !item.irreversible
  )

  if (notIrreversible) {
    await timeUtil.sleep(1)

    return getActions(params)
  }

  return {
    hasMore: data.total.value > limit + params.skip || false,
    actions: data.simple_actions
  }
}

const runUpdater = async (
  updater: Omit<defaultModel.BuilderListener, 'notified_account'>,
  actions: any[]
) => {
  for (const action of actions) {
    await updater.apply(action)
  }
}

const sync = async (): Promise<void> => {
  console.log('SYNCING')
  await coreUtil.hasura.hasuraAssembled()
  const lastSyncedAt = await getLastSyncedAt()
  const gap = getGap(lastSyncedAt)
  const after = moment(lastSyncedAt).toISOString()
  const before = moment(after)
    .add(gap.amount, gap.unit as DurationInputArg2)
    .toISOString()
  const diff = moment().diff(moment(before), 'seconds')
  let skip = 0
  let hasMore = true
  let actions = []

  if (diff < TIME_BEFORE_IRREVERSIBILITY) {
    await timeUtil.sleep(TIME_BEFORE_IRREVERSIBILITY - diff)

    return sync()
  }

  try {
    for (const updater of updaters) {
      while (hasMore) {
        ;({ hasMore, actions } = await getActions({
          after,
          before,
          skip,
          updater
        }))
        skip += actions.length

        await runUpdater(updater, actions)
      }

      skip = 0
      hasMore = true
      actions = []
    }
  } catch (error: any) {
    console.error('hyperion error', error.message)
    await timeUtil.sleep(5)

    return sync()
  }

  await hyperionStateModel.queries.saveOrUpdate(before)

  return sync()
}

const syncWorker = () => {
  return {
    name: 'SYNC ACTIONS',
    action: sync
  }
}

export default { syncWorker }
