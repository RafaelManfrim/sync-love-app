import { Button } from '@components/Button'
import { ScreenHeader } from '@components/ScreenHeader'
import {
  VStack,
  Center,
  Text,
  Pressable,
  HStack,
  CheckIcon,
  ScrollView,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'

const SUPPORTED_LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Español (España)' },
]

export function Language() {
  // const { t, i18n } = useTranslation()

  // const currentLocale = i18n.language

  const { colors } = useTheme()

  function handleChangeLanguage() {}

  return (
    <VStack flex={1}>
      <ScreenHeader title="Idiomas" hasGoBackButton />
      <ScrollView flex={1}>
        <VStack flex={1} p="$6" gap="$3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              // onPress={() => changeTheme(key as ThemeName)}
              bg={colors.card}
              p="$2"
              rounded="$md"
              borderWidth={2}
              borderColor={
                lang.code === 'pt-BR' ? colors.primary500 : 'transparent'
              }
            >
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$md" color={colors.text}>
                  {lang.name}
                </Text>
                {lang.code === 'pt-BR' && (
                  <CheckIcon color={colors.primary500} />
                )}
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
      {/* <VStack flex={1} p="$6" gap="$3">
        <Box
          bgColor="$trueGray200"
          p="$3"
          borderRadius="$md"
          borderColor="$red300"
          borderWidth={1}
        >
          <Text>Português</Text>
        </Box>
        <Box
          bgColor="$trueGray200"
          p="$3"
          borderRadius="$md"
          borderWidth={1}
          borderColor="$trueGray200"
        >
          <Text>Inglês</Text>
        </Box>
        <Box
          bgColor="$trueGray200"
          p="$3"
          borderRadius="$md"
          borderWidth={1}
          borderColor="$trueGray200"
        >
          <Text>Espanhol</Text>
        </Box>
      </VStack> */}

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Atualizar"
          onPress={handleChangeLanguage}
          // isLoading={isSubmitting}
        />
      </Center>
    </VStack>
  )
}
