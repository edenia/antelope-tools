const i18n = require('i18next')

i18n.init({
  resources: {
    en: {
      translation: {
        app_name: ''
      }
    }
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

module.exports = i18n
