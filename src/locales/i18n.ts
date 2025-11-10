import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import ptBR from './pt-BR.json'
import enUS from './en-US.json'
import esES from './es-ES.json'
import itIT from './it-IT.json'
import frFR from './fr-FR.json'
import deDE from './de-DE.json'

export const resources = {
  'pt-BR': { translation: ptBR },
  'en-US': { translation: enUS },
  'es-ES': { translation: esES },
  'it-IT': { translation: itIT },
  'fr-FR': { translation: frFR },
  'de-DE': { translation: deDE },
} as const

// Detecta o idioma do dispositivo
const deviceLanguage = getLocales()[0]?.languageTag || 'en-US'

// Mapeia o idioma do dispositivo para os idiomas suportados
const languageMap: Record<string, string> = {
  pt: 'pt-BR',
  'pt-BR': 'pt-BR',
  'pt-PT': 'pt-BR',
  en: 'en-US',
  'en-US': 'en-US',
  'en-GB': 'en-US',
  es: 'es-ES',
  'es-ES': 'es-ES',
  'es-MX': 'es-ES',
  it: 'it-IT',
  'it-IT': 'it-IT',
  fr: 'fr-FR',
  'fr-FR': 'fr-FR',
  'fr-CA': 'fr-FR',
  de: 'de-DE',
  'de-DE': 'de-DE',
  'de-AT': 'de-DE',
  'de-CH': 'de-DE',
}

// Tenta mapear o idioma completo (ex: pt-BR) ou apenas a base (ex: pt)
const getLanguage = (locale: string): string => {
  if (languageMap[locale]) {
    return languageMap[locale]
  }
  const baseLanguage = locale.split('-')[0]
  return languageMap[baseLanguage] || 'en-US' // Fallback para inglês
}

const detectedLanguage = getLanguage(deviceLanguage)

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: detectedLanguage, // Idioma detectado do dispositivo
  fallbackLng: 'en-US', // Fallback para inglês
  resources,
  interpolation: {
    escapeValue: false, // React já faz escape
  },
})

export default i18n
