import eosApi from './eosapi'

export const NODE_TYPE_LABEL = {
  1: 'validator',
  2: 'writer',
  3: 'boot',
  4: 'observer'
}

export const NODE_TYPE_ID = {
  validator: 1,
  writer: 2,
  boot: 3,
  observer: 4
}

export const getNodeFeatures = () => [
  {
    label: 'chain-api',
    value: 'chain-api'
  },
  {
    label: 'snapshot-api',
    value: 'snapshot-api'
  },
  {
    label: 'account-query',
    value: 'account-query'
  },
  {
    label: 'dfuse',
    value: 'dfuse'
  },
  {
    label: 'state history plugin',
    value: 'state history plugin'
  }
]

export const getNodes = async (type) => {
  const { rows: nodes } = await eosApi.getTableRows({
    json: true,
    code: 'eosio',
    scope: 'eosio',
    table: 'node'
  })

  if (type) {
    return nodes.filter((node) => node.type === type)
  }

  return nodes
}

export const getSchedule = () => eosApi.getProducerSchedule({})

export const getNewFieldPayload = (field, event, value, payload = {}) => {
  let newPayload = {}
  let newValue = ''

  if (
    typeof event?.target?.value === 'string' ||
    Array.isArray(event?.target?.value)
  ) {
    newValue = event.target.value
  } else if (typeof value === 'string' || Array.isArray(value)) {
    newValue = value
  } else if (typeof event === 'string' || Array.isArray(event)) {
    newValue = event
  }

  if (field.includes('.')) {
    const [parent, child] = field.split('.')
    newPayload = {
      ...payload,
      [parent]: {
        ...payload[parent],
        [child]: newValue
      }
    }
  } else {
    newPayload = {
      ...payload,
      [field]: newValue
    }
  }

  return newPayload
}
