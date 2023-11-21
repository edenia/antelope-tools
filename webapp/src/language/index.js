import { eosConfig } from '../config'
import { deepMerge } from '../utils/deep-merge'

import en from './en'
import es from './es'
import ko from './ko'
import zh from './zh'

const languajes = {
  ...es,
  ...en,
  ...ko,
  ...zh,
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
  ko: getLanguaje('ko'),
  zh: getLanguaje('zh'),
}
