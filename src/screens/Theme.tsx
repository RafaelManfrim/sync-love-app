import { ScreenHeader } from '@components/ScreenHeader'
import {
  Box,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { Check } from 'lucide-react-native'
import { ThemeName } from '../theme'

export function Theme() {
  const { currentTheme, changeTheme, colors, customTheme } = useTheme()

  const themes: Record<ThemeName, { name: string }> = {
    default: { name: 'Padrão Claro' },
    defaultDark: { name: 'Padrão Escuro' },
    oceanBlue: { name: 'Azul Oceano' },
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Temas" hasGoBackButton />
      <VStack flex={1} p="$6" gap="$3">
        {Object.entries(themes).map(([key, theme]) => (
          <Pressable
            key={key}
            onPress={() => changeTheme(key as ThemeName)}
            bg={colors.card}
            p="$4"
            rounded="$md"
            borderWidth={2}
            borderColor={
              currentTheme === key ? colors.primary500 : 'transparent'
            }
          >
            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space="md">
                <Box
                  w="$8"
                  h="$8"
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

      {/* <Center w="$full" gap="$3" p="$6">
        <Button
          title="Atualizar"
          onPress={handleChangeTheme}
          // isLoading={isSubmitting}
        />
      </Center> */}
    </VStack>
  )
}
