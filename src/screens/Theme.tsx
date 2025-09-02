import { Button } from '@components/Button'
import { ScreenHeader } from '@components/ScreenHeader'
import { Box, Center, HStack, Text, VStack } from '@gluestack-ui/themed'

export function Theme() {
  function handleChangeTheme() {}
  return (
    <VStack flex={1}>
      <ScreenHeader title="Temas" hasGoBackButton />
      <VStack flex={1} p="$6" gap="$3">
        <HStack
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
        </HStack>
      </VStack>

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Atualizar"
          onPress={handleChangeTheme}
          // isLoading={isSubmitting}
        />
      </Center>
    </VStack>
  )
}
