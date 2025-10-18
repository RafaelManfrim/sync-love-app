import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
  HStack,
  Icon,
  Box,
} from '@gluestack-ui/themed'
import Logo from '@assets/sync_love_square-no-bg.png'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { TrashIcon } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'
import { Loading } from '@components/Loading'
import {
  useAcceptInvite,
  useDeleteInvite,
  useInvitations,
  useRejectInvite,
} from '@hooks/api/useInvitationQueries'
import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'

export function WaitingPartner() {
  const { data: invitations, isLoading } = useInvitations()
  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite()
  const { mutate: rejectInvite, isPending: isRejecting } = useRejectInvite()
  const { mutate: deleteInvite, isPending: isDeleting } = useDeleteInvite()

  const navigation = useNavigation<AuthNavigationRoutesProps>()

  const { getUserData } = useAuth()

  const isLoadingSomething =
    isLoading || isAccepting || isRejecting || isDeleting

  function handleInvite() {
    navigation.navigate('invitePartner')
  }

  useEffect(() => {
    if (invitations?.sentInvites.some((invite) => invite.accepted_at)) {
      getUserData()
    }
  }, [invitations])

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px="$8" pb="$16">
        <Center my="$16">
          <Image source={Logo} defaultSource={Logo} alt="Logo Sync Love" />

          <Text color="$trueGray700" fontSize="$sm" textAlign="center">
            Tenha um relacionamento melhor com seu parceiro
          </Text>
        </Center>

        <Center gap="$2">
          <Heading color="$trueGray700">Encontre seu parceiro</Heading>

          <Text
            color="$trueGray700"
            textAlign="center"
            fontFamily="$heading"
            bold
          >
            Convites recebidos
          </Text>

          {/* Listagen de convites recebidos e enviados */}
          {invitations?.recievedInvites.length === 0 && (
            <Text color="$trueGray700">Nenhum convite recebido</Text>
          )}

          {invitations?.recievedInvites.map((invite) => (
            <VStack
              key={invite.id}
              w="$full"
              px="$4"
              py="$2"
              bg="$white"
              borderWidth={1}
              borderColor="$trueGray200"
              borderRadius="$md"
            >
              <VStack>
                <Text color="$trueGray600">De: {invite.inviter.name}</Text>
                <Text color="$trueGray600" fontSize="$sm">
                  {invite.inviter.email}
                </Text>
              </VStack>

              <HStack
                alignItems="center"
                justifyContent="space-between"
                mt="$1"
                w="$full"
              >
                <Text color="$trueGray500" fontSize="$sm">
                  Recebido em:
                </Text>
                <Text color="$trueGray400" fontSize="$sm">
                  {new Date(invite.invited_at).toLocaleDateString()}
                  {' - '}
                  {new Date(invite.invited_at).toLocaleTimeString()}
                </Text>
              </HStack>
              <HStack mt="$1" w="$full" gap="$2">
                <Button
                  w="auto"
                  title="Recusar"
                  variant="outline"
                  onPress={() => rejectInvite(invite.id)}
                  flex={1}
                  h="$10"
                />

                <Button
                  w="auto"
                  flex={1}
                  title="Aceitar"
                  onPress={() => acceptInvite(invite.id)}
                  h="$10"
                />
              </HStack>
            </VStack>
          ))}

          <Box>{isLoadingSomething && <Loading />}</Box>

          <Text
            color="$trueGray700"
            textAlign="center"
            mt="$4"
            fontFamily="$heading"
            bold
          >
            Convites enviados
          </Text>

          {invitations?.sentInvites.length === 0 && (
            <Text color="$trueGray700">Nenhum convite enviado</Text>
          )}

          {invitations?.sentInvites.map((invite) => (
            <VStack
              key={invite.id}
              w="$full"
              px="$4"
              py="$2"
              bg="$white"
              borderWidth={1}
              borderColor="$trueGray200"
              borderRadius="$md"
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
                w="$full"
              >
                <Text color="$trueGray600">{invite.invitee_email}</Text>

                <TouchableOpacity onPress={() => deleteInvite(invite.id)}>
                  <Icon as={TrashIcon} size="lg" color="$error500" />
                </TouchableOpacity>
              </HStack>
              <HStack
                alignItems="center"
                justifyContent="space-between"
                mt="$1"
                w="$full"
              >
                <Text color="$trueGray500" fontSize="$sm">
                  Enviado em:
                </Text>
                <Text color="$trueGray400" fontSize="$sm">
                  {new Date(invite.invited_at).toLocaleDateString()}
                  {' - '}
                  {new Date(invite.invited_at).toLocaleTimeString()}
                </Text>
              </HStack>
            </VStack>
          ))}

          <Box>{isLoadingSomething && <Loading />}</Box>
        </Center>

        <Center flex={1} justifyContent="flex-end" mt="$4">
          <Button title="Convidar Parceiro" onPress={handleInvite} />
        </Center>
      </VStack>
    </ScrollView>
  )
}
