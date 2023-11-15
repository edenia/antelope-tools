import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { generalConfig } from './config'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: 'unspecific',
    resources: generalConfig.languageResources,
    fallbackNS: 'common',
    fallbackLng: generalConfig.defaultLanguage,
    supportedLngs: generalConfig.languages,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
