import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
  HStack,
  Icon,
} from '@gluestack-ui/themed'
import Logo from '@assets/sync_love_square-no-bg.png'
import { Button } from '@components/Button'
import { useAuth } from '@hooks/useAuth'
import { useEffect, useState } from 'react'
import { api } from '@services/api'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { TrashIcon } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

interface Invite {
  id: number
  inviter_id: number
  invitee_email: string
  invited_at: string
  accepted_at: string | null
  rejected_at: string | null
  inviter: {
    email: string
    name: string
    gender: string
    avatar_url: string | null
  }
}

interface Invitations {
  recievedInvites: Invite[]
  sentInvites: Invite[]
}

export function WaitingPartner() {
  const [invitations, setInvitations] = useState<Invitations>()
  const [isLoading, setIsLoading] = useState(false)

  const { user, getUserData } = useAuth()
  const navigation = useNavigation<AuthNavigationRoutesProps>()

  function handleInvite() {
    navigation.navigate('invitePartner')
  }

  async function handleDeleteInvite(id: number) {
    try {
      setIsLoading(true)
      await api.delete(`/couple-invitations/${id}`)
      setInvitations((prevState) => ({
        ...prevState,
        sentInvites: prevState!.sentInvites.filter(
          (invite) => invite.id !== id,
        ),
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAcceptInvite(id: number) {
    try {
      setIsLoading(true)
      await api.post(`/couple-invitations/${id}/accept`)
      await getUserData()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRejectInvite(id: number) {
    try {
      setIsLoading(true)
      await api.post(`/couple-invitations/${id}/reject`)
      setInvitations((prevState) => ({
        ...prevState,
        recievedInvites: prevState!.recievedInvites.filter(
          (invite) => invite.id !== id,
        ),
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    async function fetchInvitations() {
      try {
        setIsLoading(true)
        const response = await api.get('/couple-invitations')

        setInvitations(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!user.couple_id) {
      fetchInvitations() // primeira chamada imediata

      intervalId = setInterval(() => {
        fetchInvitations()
      }, 10000) // 15 segundos
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [user])

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
                  onPress={() => handleRejectInvite(invite.id)}
                  flex={1}
                  h="$10"
                />

                <Button
                  w="auto"
                  flex={1}
                  title="Aceitar"
                  onPress={() => handleAcceptInvite(invite.id)}
                  h="$10"
                />
              </HStack>
            </VStack>
          ))}

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

                <TouchableOpacity onPress={() => handleDeleteInvite(invite.id)}>
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
        </Center>

        <Center flex={1} justifyContent="flex-end" mt="$4">
          <Button title="Convidar Parceiro" onPress={handleInvite} />
        </Center>
      </VStack>
    </ScrollView>
  )
}
