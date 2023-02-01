const { eosConfig } = require('../config')

const { hasuraUtil, axiosUtil } = require('../utils')

const UPSERT = `
  mutation ($setting: setting_insert_input!) {
    insert_setting(objects: [$setting], on_conflict: {constraint: setting_pkey, update_columns: [token_price]}) {
      affected_rows
    }
  }
`

const syncEOSPrice = async () => {
  try {
    if (!eosConfig.exchangeRateApi) {
      return
    }

    const { data } = await axiosUtil.instance.get(eosConfig.exchangeRateApi)

    if (!data || !data[eosConfig.coingeckoApiTokenId]) {
      return
    }

    const response = data[eosConfig.coingeckoApiTokenId]
    const tokenPrice = !isNaN(response?.usd) ? response.usd : response

    await hasuraUtil.request(UPSERT, {
      setting: { id: 1, token_price: tokenPrice }
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  syncEOSPrice
}
