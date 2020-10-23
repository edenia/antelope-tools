import { eosConfig } from '../config'

import en from './en.json'
import es from './es.json'
import enLacchain from './en.lacchain.json'
import esLacchain from './es.lacchain.json'

const languajes = {
  es: {
    lacchain: esLacchain,
    default: es
  },
  en: {
    lacchain: enLacchain,
    default: en
  }
}

const getLanguaje = (languaje) => {
  return (
    languajes[languaje][eosConfig.networkName] || languajes[languaje].default
  )
}

export default {
  en: getLanguaje('en'),
  es: getLanguaje('es')
}
