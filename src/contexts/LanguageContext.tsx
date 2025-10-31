import { createContext, ReactNode, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LANGUAGE_STORAGE } from '@storage/config'

export type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES'

export type LanguageContextData = {
  currentLanguage: LanguageCode
  changeLanguage: (language: LanguageCode) => Promise<void>
  isLoading: boolean
}

export const LanguageContext = createContext<LanguageContextData>(
  {} as LanguageContextData,
)

export function LanguageContextProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('pt-BR')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadLanguageFromStorage() {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE)
        if (storedLanguage && isValidLanguageCode(storedLanguage)) {
          await i18n.changeLanguage(storedLanguage)
          setCurrentLanguage(storedLanguage as LanguageCode)
        }
      } catch (error) {
        console.error('Erro ao carregar idioma:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadLanguageFromStorage()
  }, [i18n])

  const changeLanguage = async (language: LanguageCode) => {
    if (language === currentLanguage) {
      return
    }

    try {
      await i18n.changeLanguage(language)
      await AsyncStorage.setItem(LANGUAGE_STORAGE, language)
      setCurrentLanguage(language)
    } catch (error) {
      console.error('Erro ao mudar idioma:', error)
    }
  }

  const isValidLanguageCode = (code: string): code is LanguageCode => {
    return ['pt-BR', 'en-US', 'es-ES'].includes(code)
  }

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, changeLanguage, isLoading }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
