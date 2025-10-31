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

export function Theme() {
  const { currentTheme, changeTheme, colors, customTheme } = useTheme()

  const themes: Record<ThemeName, { name: string }> = {
    default: { name: 'Padrão Claro' },
    defaultDark: { name: 'Padrão Escuro' },
    romanticPink: { name: 'Rosa Romântico' },
    romanticPinkDark: { name: 'Rosa Romântico Escuro' },
    royalPurple: { name: 'Roxo Real' },
    royalPurpleDark: { name: 'Roxo Real Escuro' },
    oceanBlue: { name: 'Azul Oceano' },
    oceanBlueDark: { name: 'Azul Oceano Escuro' },
    freshGreen: { name: 'Verde Fresco' },
    freshGreenDark: { name: 'Verde Fresco Escuro' },
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Temas" hasGoBackButton />
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
          {/* <HStack
            bgColor="$trueGray200"
            p="$3"
            borderRadius="$md"
            borderColor="$red300"
            borderWidth={1}
            alignItems="center"
          >
            <Text mr="auto">Tema Romântico</Text>
            <HStack gap="$1">
              <Box w="$8" h="$8" bgColor="$blue500" rounded="$full"></Box>
              <Box w="$8" h="$8" bgColor="$pink500" rounded="$full"></Box>
            </HStack>
          </HStack>
          <HStack
            bgColor="$trueGray200"
            p="$3"
            borderRadius="$md"
            borderColor="$trueGray200"
            borderWidth={1}
            alignItems="center"
          >
            <Text mr="auto">Tema Fofo</Text>
            <HStack gap="$1">
              <Box w="$8" h="$8" bgColor="$green500" rounded="$full"></Box>
              <Box w="$8" h="$8" bgColor="$violet500" rounded="$full"></Box>
            </HStack>
          </HStack>
          <HStack
            bgColor="$trueGray200"
            p="$3"
            borderRadius="$md"
            borderColor="$trueGray200"
            borderWidth={1}
            alignItems="center"
          >
            <Text mr="auto">Tema Gótico</Text>
            <HStack gap="$1">
              <Box w="$8" h="$8" bgColor="$darkBlue500" rounded="$full"></Box>
              <Box w="$8" h="$8" bgColor="$purple500" rounded="$full"></Box>
            </HStack>
          </HStack>
          <HStack
            bgColor="$trueGray200"
            p="$3"
            borderRadius="$md"
            borderColor="$trueGray200"
            borderWidth={1}
            alignItems="center"
          >
            <Text mr="auto">Tema Chique</Text>
            <HStack gap="$1">
              <Box w="$8" h="$8" bgColor="$emerald500" rounded="$full"></Box>
              <Box w="$8" h="$8" bgColor="$amber500" rounded="$full"></Box>
            </HStack>
          </HStack> */}
        </VStack>
      </ScrollView>
    </VStack>
  )
}
