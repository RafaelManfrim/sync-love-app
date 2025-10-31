import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ptBR from './pt-BR.json'
import enUS from './en-US.json'
import esES from './es-ES.json'

export const resources = {
  'pt-BR': { translation: ptBR },
  'en-US': { translation: enUS },
  'es-ES': { translation: esES },
} as const

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'pt-BR', // Idioma padrão
  fallbackLng: 'pt-BR',
  resources,
  interpolation: {
    escapeValue: false, // React já faz escape
  },
})

export default i18n
