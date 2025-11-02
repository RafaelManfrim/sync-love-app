import { createContext, ReactNode, useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LANGUAGE_STORAGE } from '@storage/config'

export type LanguageCode = 'pt-BR' | 'en-US' | 'es-ES'

export type LanguageContextData = {
  currentLanguage: LanguageCode
  changeLanguage: (language: LanguageCode) => Promise<void>
  isLoading: boolean
  localeKey: string
  getCurrencyConfig: () => { locale: string; currency: string }
}

export const LanguageContext = createContext<LanguageContextData>(
  {} as LanguageContextData,
)

export function LanguageContextProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('pt-BR')
  const [isLoading, setIsLoading] = useState(true)

  const localeKey = useMemo(() => {
    return currentLanguage === 'pt-BR'
      ? 'pt-br'
      : currentLanguage === 'en-US'
        ? 'en'
        : 'es'
  }, [currentLanguage])

  const getCurrencyConfig = () => {
    switch (currentLanguage) {
      case 'pt-BR':
        return { locale: 'pt-BR', currency: 'BRL' }
      case 'en-US':
        return { locale: 'en-US', currency: 'USD' }
      case 'es-ES':
        return { locale: 'es-ES', currency: 'EUR' }
      default:
        return { locale: 'pt-BR', currency: 'BRL' }
    }
  }

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
      value={{
        currentLanguage,
        changeLanguage,
        isLoading,
        localeKey,
        getCurrencyConfig,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
