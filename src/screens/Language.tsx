import { Button } from '@components/Button'
import { ScreenHeader } from '@components/ScreenHeader'
import { VStack, Center, Box, Text } from '@gluestack-ui/themed'

export function Language() {
  function handleChangeLanguage() {}

  return (
    <VStack flex={1}>
      <ScreenHeader title="Idiomas" hasGoBackButton />
      <VStack flex={1} p="$6" gap="$3">
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
      </VStack>

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
