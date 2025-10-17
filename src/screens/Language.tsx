import { Button } from '@components/Button'
import { ScreenHeader } from '@components/ScreenHeader'
import {
  VStack,
  Center,
  Text,
  Pressable,
  HStack,
  CheckIcon,
} from '@gluestack-ui/themed'

const SUPPORTED_LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Español (España)' },
]

export function Language() {
  // const { t, i18n } = useTranslation()

  // const currentLocale = i18n.language

  function handleChangeLanguage() {}

  return (
    <VStack flex={1}>
      <ScreenHeader title="Idiomas" hasGoBackButton />
      <VStack p="$5" flex={1}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            bg="$trueGray200"
            p="$4"
            rounded="$md"
            mb="$3"
          >
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontSize="$md">{lang.name}</Text>
              {lang.code === 'pt-BR' && <CheckIcon color="$green500" />}
            </HStack>
          </Pressable>
        ))}
      </VStack>
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
