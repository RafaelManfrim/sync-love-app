import { ScreenHeader } from '@components/ScreenHeader'
import {
  Box,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  ScrollView,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { Check } from 'lucide-react-native'
import { ThemeName } from '../theme'
import { useTranslation } from 'react-i18next'

export function Theme() {
  const { t } = useTranslation()
  const { currentTheme, changeTheme, colors, customTheme } = useTheme()

  const themes: Record<ThemeName, { name: string }> = {
    default: { name: t('theme.default') },
    defaultDark: { name: t('theme.defaultDark') },
    romanticPink: { name: t('theme.romanticPink') },
    romanticPinkDark: { name: t('theme.romanticPinkDark') },
    royalPurple: { name: t('theme.royalPurple') },
    royalPurpleDark: { name: t('theme.royalPurpleDark') },
    oceanBlue: { name: t('theme.oceanBlue') },
    oceanBlueDark: { name: t('theme.oceanBlueDark') },
    freshGreen: { name: t('theme.freshGreen') },
    freshGreenDark: { name: t('theme.freshGreenDark') },
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('theme.title')} hasGoBackButton />
      <ScrollView flex={1}>
        <VStack flex={1} p="$6" gap="$3">
          {Object.entries(themes).map(([key, theme]) => (
            <Pressable
              key={key}
              onPress={() => changeTheme(key as ThemeName)}
              bg={colors.card}
              p="$2"
              rounded="$md"
              borderWidth={2}
              borderColor={
                currentTheme === key ? colors.primary500 : 'transparent'
              }
              $active={{
                opacity: 0.7,
                transform: [{ scale: 0.98 }],
              }}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack alignItems="center" space="md">
                  <Box
                    w="$6"
                    h="$6"
                    rounded="$full"
                    bgColor={
                      customTheme.config.tokens.colors[key as ThemeName]
                        .primary500
                    }
                  />
                  <Text color={colors.text} fontSize="$md">
                    {theme.name}
                  </Text>
                </HStack>
                {currentTheme === key && (
                  <Icon as={Check} color={colors.primary500} />
                )}
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  )
}
