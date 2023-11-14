import { eosConfig } from '../config'
import { deepMerge } from '../utils/deep-merge'

import en from './en'
import es from './es'

const languajes = {
  ...es,
  ...en,
}

const getLanguaje = (languaje) => {
  if (languajes[`${languaje}.${eosConfig.networkName}`]) {
    return deepMerge(
      languajes[languaje],
      languajes[`${languaje}.${eosConfig.networkName}`],
    )
  }

  return languajes[languaje] || {}
}

export default {
  en: getLanguaje('en'),
  es: getLanguaje('es'),
}
