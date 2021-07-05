import { eosConfig } from '../config'
import { deepMerge } from '../utils/deep-merge'

import en from './en.json'
import es from './es.json'
import enLacchain from './en.lacchain.json'
import esLacchain from './es.lacchain.json'
import enTelos from './en.telos-testnet.json'
import esTelos from './es.telos-testnet.json'
import enJungle from './en.jungle.json'
import esJungle from './es.jungle.json'
import enMainnet from './en.mainnet.json'
import esMainnet from './es.mainnet.json'
import enProton from './en.proton-testnet.json'
import esProton from './es.proton-testnet.json'
import enWax from './en.wax-testnet.json'
import esWax from './es.wax-testnet.json'

const languajes = {
  es,
  en,
  'es.lacchain': esLacchain,
  'en.lacchain': enLacchain,
  'es.telos-testnet': esTelos,
  'en.telos-testnet': enTelos,
  'es.jungle': esJungle,
  'en.jungle': enJungle,
  'es.mainnet': esMainnet,
  'en.mainnet': enMainnet,
  'es.proton-testnet': esProton,
  'en.proton-testnet': enProton,
  'es.wax-testnet': esWax,
  'en.wax-testnet': enWax
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
