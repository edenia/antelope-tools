const { eosConfig } = require('../config')
const { axiosUtil } = require('../utils')

module.exports = {
  method: 'POST',
  path: '/get-eos-rate',
  handler: async () => {
    if (
      !eosConfig.eosRateUrl ||
      !eosConfig.eosRateUser ||
      !eosConfig.eosRatePassword
    ) {
      return []
    }

    const buf = Buffer.from(
      `${eosConfig.eosRateUser}:${eosConfig.eosRatePassword}`,
      'utf8'
    )
    const auth = buf.toString('base64')

    const { data } = await axiosUtil.instance.post(
      eosConfig.eosRateUrl,
      { ratesStatsInput: {} },
      {
        headers: { Authorization: `Basic ${auth}` }
      }
    )

    return data?.getRatesStats?.bpsStats || []
  },
  options: {
    auth: false
  }
}
