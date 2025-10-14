import { Center, HStack, Text, VStack } from '@gluestack-ui/themed'

import { UserPhoto } from '@components/UserPhoto'
import { ScreenHeader } from '@components/ScreenHeader'
import { Button } from '@components/Button'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'

export function Partner() {
  const {
    user: { couple },
  } = useAuth()

  function handleEndRelationship() {
    console.log('Função terminar relacionamento')
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Relacionamento" />

      <VStack flex={1} p="$6" gap="$3">
        <HStack
          w="$full"
          bgColor="$trueGray200"
          alignItems="center"
          p="$3"
          borderRadius="$md"
        >
          <UserPhoto
            source={
              couple?.User[0].avatar_url
                ? {
                    uri: `${api.defaults.baseURL}/avatar/${couple?.User[0].avatar_url}`,
                  }
                : DefaultUserPhoto
            }
            w="$16"
            h="$16"
            alt="Foto de perfil do usuário"
            size="xl"
          />

          <VStack pl="$3" mr="auto">
            <Text>{couple?.User[0].name}</Text>
            <Text fontSize="$sm" color="$trueGray500">
              {couple?.User[0].email}
            </Text>
          </VStack>
        </HStack>

        <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
          <Text>Juntos desde {couple?.created_at}</Text>
        </VStack>
        <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
          <Text>3 listas criadas juntos</Text>
        </VStack>
        <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
          <Text>15 tarefas criadas</Text>
          <Text>10 tarefas concluídas por você</Text>
          <Text>5 tarefas concluídas por {couple?.User[0].name}</Text>
        </VStack>
        <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
          <Text>10 datas importantes salvas </Text>
        </VStack>
      </VStack>

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Terminar Relacionamento"
          onPress={handleEndRelationship}
          // isLoading={isSubmitting}
        />
      </Center>
    </VStack>
  )
}
