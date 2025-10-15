import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Updates from 'expo-updates'

// Importe os arquivos de tradução
import ptBR from '../locales/pt-BR.json'
import enUS from '../locales/en-US.json'
import esES from '../locales/es-ES.json'
import { LOCALE_STORAGE } from '@storage/config'

const resources = {
  'en-US': { translation: enUS },
  'pt-BR': { translation: ptBR },
  'es-ES': { translation: esES },
}

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE)
      if (savedLocale) {
        return callback(savedLocale)
      }

      const bestLocale = RNLocalize.findBestLanguageTag(Object.keys(resources))
      return callback(bestLocale?.languageTag || 'en-US')
    } catch (error) {
      console.log('Error reading language', error)
      return callback('en-US')
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE, lng)
    } catch (error) {
      console.log('Error saving language', error)
    }
  },
}

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    compatibilityJSON: 'v3', // Importante para o React Native
    interpolation: {
      escapeValue: false,
    },
  })

// Função para mudar o idioma
export const setLanguage = async (lng: string) => {
  await i18n.changeLanguage(lng)
  await Updates.reloadAsync() // Reinicia para aplicar em todo o app
}

export default i18n

// // Crie a instância do i18n
// const i18n = new I18n()

// // Defina as traduções disponíveis
// i18n.translations = {
//   'pt-BR': ptBR,
//   'en-US': enUS,
//   'es-ES': esES,
// }

// export async function loadLocale() {
//   try {
//     const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE)
//     if (savedLocale) {
//       i18n.locale = savedLocale
//     } else {
//       i18n.locale = Localization.getLocales()[0].languageTag
//     }
//   } catch (error) {
//     console.error('Falha ao carregar o idioma do storage', error)
//     i18n.locale = Localization.getLocales()[0].languageTag
//   }
// }

// export async function setLocale(locale: string) {
//   try {
//     i18n.locale = locale
//     await AsyncStorage.setItem(LOCALE_STORAGE, locale)

//     // Reinicia o aplicativo para aplicar o novo idioma em tudo
//     await Updates.reloadAsync()
//   } catch (error) {
//     console.error('Falha ao salvar o idioma no storage', error)
//   }
// }

// // Detecta o idioma do dispositivo do usuário
// const userLocale = Localization.getLocales()[0].languageTag
// i18n.locale = userLocale

// // Habilita o fallback para um idioma padrão (ex: inglês) caso uma chave não seja encontrada no idioma atual
// i18n.enableFallback = true
// i18n.defaultLocale = 'en-US' // Defina um idioma padrão

// // Função para tradução (helper)
// export const t = (scope: string | string[], options?: object) => {
//   return i18n.t(scope, options)
// }

// export default i18n
