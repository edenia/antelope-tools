import { eosConfig } from '../config'
import { deepMerge } from '../utils/deep-merge'

import en from './en.json'
import es from './es.json'
import enLacchain from './en.lacchain.json'
import esLacchain from './es.lacchain.json'

const languajes = {
  es,
  en,
  'es.lacchain': esLacchain,
  'en.lacchain': enLacchain
}

const getLanguaje = (languaje) => {
  if (languajes[`${languaje}.${eosConfig.networkName}`]) {
    return deepMerge(
      languajes[languaje],
      languajes[`${languaje}.${eosConfig.networkName}`]
    )
  }

  return languajes[languaje] || {}
}

export default {
  en: getLanguaje('en'),
  es: getLanguaje('es')
}
