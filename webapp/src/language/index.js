import { eosConfig } from '../config'
import { deepMerge } from '../utils/deep-merge'

import en from './en.json'
import es from './es.json'
import enLacchain from './en.lacchain.json'
import esLacchain from './es.lacchain.json'
import enTelos from './en.telos.json'
import esTelos from './es.telos.json'
import enJungle from './en.jungle.json'
import esJungle from './es.jungle.json'
import enMainnet from './en.mainnet.json'
import esMainnet from './es.mainnet.json'

const languajes = {
  es,
  en,
  'es.lacchain': esLacchain,
  'en.lacchain': enLacchain,
  'es.telos': esTelos,
  'en.telos': enTelos,
  'es.jungle': esJungle,
  'en.jungle': enJungle,
  'es.mainnet': esMainnet,
  'en.mainnet': enMainnet
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
