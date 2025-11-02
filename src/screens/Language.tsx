import { ScreenHeader } from '@components/ScreenHeader'
import {
  VStack,
  Text,
  Pressable,
  HStack,
  CheckIcon,
  ScrollView,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { useLanguage } from '@hooks/useLanguage'
import { useState } from 'react'
import type { LanguageCode } from '@contexts/LanguageContext'
import { useTranslation } from 'react-i18next'

export function Language() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { currentLanguage, changeLanguage } = useLanguage()
  const [isChanging, setIsChanging] = useState(false)

  const SUPPORTED_LANGUAGES: Array<{ code: LanguageCode; name: string }> = [
    { code: 'pt-BR', name: t('language.portuguese') },
    { code: 'en-US', name: t('language.english') },
    { code: 'es-ES', name: t('language.spanish') },
    { code: 'it-IT', name: t('language.italian') },
    { code: 'fr-FR', name: t('language.french') },
    { code: 'de-DE', name: t('language.german') },
  ]

  const handleSelectLanguage = async (code: LanguageCode) => {
    if (code === currentLanguage || isChanging) {
      return
    }

    try {
      setIsChanging(true)
      await changeLanguage(code)
    } catch (error) {
      console.error('Erro ao atualizar idioma:', error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader title={t('language.title')} hasGoBackButton />
      <ScrollView flex={1}>
        <VStack flex={1} p="$6" gap="$3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => handleSelectLanguage(lang.code)}
              bg={colors.card}
              p="$2"
              rounded="$md"
              borderWidth={2}
              borderColor={
                currentLanguage === lang.code
                  ? colors.primary500
                  : 'transparent'
              }
              opacity={isChanging ? 0.6 : 1}
              disabled={isChanging}
              $active={{
                opacity: 0.7,
                transform: [{ scale: 0.98 }],
              }}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <Text
                  fontSize="$md"
                  color={colors.text}
                  fontWeight={
                    currentLanguage === lang.code ? '$bold' : '$normal'
                  }
                >
                  {lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <CheckIcon color={colors.primary500} size="lg" />
                )}
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  )
}
