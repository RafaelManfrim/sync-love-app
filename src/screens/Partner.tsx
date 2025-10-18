import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
  AlertDialogHeader,
  Pressable,
} from '@gluestack-ui/themed'

import { UserPhoto } from '@components/UserPhoto'
import { ScreenHeader } from '@components/ScreenHeader'
import { Button } from '@components/Button'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { useState } from 'react'
import { Loading } from '@components/Loading'
import { format } from 'date-fns'
import {
  useCoupleDetails,
  useEndRelationship,
} from '@hooks/api/useCoupleQueries'

export function Partner() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { user } = useAuth()

  const { data: coupleDetails, isLoading } = useCoupleDetails()
  const { mutate: endRelationship, isPending: isSubmitting } =
    useEndRelationship()

  const partner = coupleDetails?.User.find((u) => u.id !== user.id)

  async function handleEndRelationship() {
    endRelationship()
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Relacionamento" />

      {!isLoading ? (
        <>
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
                  partner?.avatar_url
                    ? {
                        uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${partner?.avatar_url}`,
                      }
                    : DefaultUserPhoto
                }
                w="$12"
                h="$12"
                alt="Foto de perfil do usuário"
                size="xl"
              />

              <VStack pl="$3" mr="auto">
                <Text>{partner?.name}</Text>
                <Text fontSize="$sm" color="$trueGray500">
                  {partner?.email}
                </Text>
              </VStack>
            </HStack>

            <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Juntos desde:</Text>
                <Text fontWeight="bold" color="$red500">
                  {format(
                    new Date(coupleDetails?.created_at || 0),
                    'dd/MM/yyyy',
                  )}
                </Text>
              </HStack>
            </VStack>
            <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Listas:</Text>
                <Text fontWeight="bold" color="$red500">
                  {coupleDetails?._count.ShoppingLists ?? 0}
                </Text>
              </HStack>
            </VStack>
            {/* <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Tarefas Criadas:</Text>
                <Text fontWeight="bold" color="$red500">
                  15
                </Text>
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Concluídas por você:</Text>
                <Text fontWeight="bold" color="$red500">
                  10
                </Text>
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Concluídas por {partner?.name}:</Text>
                <Text fontWeight="bold" color="$red500">
                  5
                </Text>
              </HStack>
            </VStack> 
            <VStack w="$full" bgColor="$trueGray200" p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text>Datas importantes:</Text>
                <Text fontWeight="bold" color="$red500">
                  3
                </Text>
              </HStack>
            </VStack> */}
          </VStack>
          <Center w="$full" gap="$3" p="$6">
            <Button
              title="Terminar Relacionamento"
              onPress={() => setShowConfirmDialog(true)}
              variant="outline"
            />
          </Center>
          <AlertDialog
            isOpen={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
          >
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading>Terminar Relacionamento</Heading>
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text>
                  Você tem certeza? Esta ação é irreversível e irá desvincular
                  vocês dois no aplicativo.
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <ButtonGroup space="lg">
                  <Pressable onPress={() => setShowConfirmDialog(false)}>
                    <Text>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleEndRelationship}
                    disabled={isSubmitting}
                  >
                    <Text color={isSubmitting ? '$trueGray400' : '$red500'}>
                      {isSubmitting ? 'Encerando...' : 'Sim, terminar'}
                    </Text>
                  </Pressable>
                </ButtonGroup>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <Loading />
      )}
    </VStack>
  )
}
