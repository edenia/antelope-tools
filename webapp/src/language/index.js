import { eosConfig } from '../config'
import { deepMerge } from '../utils/deep-merge'

import en from './en.json'
import es from './es.json'
import enLacchain from './en.lacchain.json'
import esLacchain from './es.lacchain.json'
import enTelosTestnet from './en.telos-testnet.json'
import esTelosTestnet from './es.telos-testnet.json'
import enPhoenixTestnet from './en.phoenix-testnet.json'
import esPhoenixTestnet from './es.phoenix-testnet.json'
import enTelos from './en.telos.json'
import esTelos from './es.telos.json'
import enJungle from './en.jungle.json'
import esJungle from './es.jungle.json'
import enMainnet from './en.mainnet.json'
import esMainnet from './es.mainnet.json'
import enProtonTestnet from './en.proton-testnet.json'
import esProtonTestnet from './es.proton-testnet.json'
import enProton from './en.proton.json'
import esProton from './es.proton.json'
import enWaxTestnet from './en.wax-testnet.json'
import esWaxTestnet from './es.wax-testnet.json'
import enWax from './en.wax.json'
import esWax from './es.wax.json'
import enAirwire from './en.airwire.json'
import esAirwire from './es.airwire.json'
import enAirwireTestnet from './en.airwire-testnet.json'
import esAirwireTestnet from './es.airwire-testnet.json'

const languajes = {
  es,
  en,
  'es.lacchain': esLacchain,
  'en.lacchain': enLacchain,
  'es.telos': esTelos,
  'en.telos': enTelos,
  'es.proton': esProton,
  'en.proton': enProton,
  'es.wax': esWax,
  'en.wax': enWax,
  'es.jungle': esJungle,
  'en.jungle': enJungle,
  'es.mainnet': esMainnet,
  'en.mainnet': enMainnet,
  'es.telos-testnet': esTelosTestnet,
  'en.telos-testnet': enTelosTestnet,
  'es.phoenix-testnet': esPhoenixTestnet,
  'en.phoenix-testnet': enPhoenixTestnet,
  'es.proton-testnet': esProtonTestnet,
  'en.proton-testnet': enProtonTestnet,
  'es.wax-testnet': esWaxTestnet,
  'en.wax-testnet': enWaxTestnet,
  'es.airwire': esAirwire,
  'en.airwire': enAirwire,
  'es.airwire-testnet': esAirwireTestnet,
  'en.airwire-testnet': enAirwireTestnet
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
