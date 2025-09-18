import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
} from '@gluestack-ui/themed'
import Logo from '@assets/sync_love_square-no-bg.png'
import { Button } from '@components/Button'
import { useAuth } from '@hooks/useAuth'
import { useEffect, useState } from 'react'
import { api } from '@services/api'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'

interface Invite {
  id: number
  inviter_id: number
  invitee_email: string
  invited_at: string
  accepted_at: string | null
  rejected_at: string | null
}

interface Invitations {
  recievedInvites: Invite[]
  sentInvites: Invite[]
}

export function WaitingPartner() {
  const [invitations, setInvitations] = useState<Invitations>()
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useAuth()
  const navigation = useNavigation<AuthNavigationRoutesProps>()

  function handleInvite() {
    navigation.navigate('invitePartner')
  }

  function handleDeleteInvite() {
    // Lógica para deletar o convite enviado
  }

  function handleAcceptInvite() {
    // Lógica para aceitar o convite recebido
  }

  function handleRejectInvite() {
    // Lógica para rejeitar o convite recebido
  }

  useEffect(() => {
    async function fetchInvitations() {
      try {
        setIsLoading(true)
        const response = await api.get('/couple-invitations')

        console.log(response.data)

        setInvitations(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!user.couple_id) {
      fetchInvitations()
    }
  }, [user])

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px="$10" pb="$16">
        <Center my="$16">
          <Image source={Logo} defaultSource={Logo} alt="Logo Sync Love" />

          <Text color="$trueGray700" fontSize="$sm" textAlign="center">
            Tenha um relacionamento melhor com seu parceiro
          </Text>
        </Center>

        <Center gap="$2">
          <Heading color="$trueGray700">Encontre seu parceiro</Heading>

          <Text color="$trueGray700" textAlign="center">
            Convites recebidos
          </Text>

          {/* Listagen de convites recebidos e enviados */}
          {invitations?.recievedInvites.length === 0 && (
            <Text color="$trueGray700">Nenhum convite recebido</Text>
          )}

          {invitations?.recievedInvites.map((invite) => (
            <Text key={invite.id} color="$trueGray700">
              Convite recebido de: {invite.inviter_id}
              {/* Adicionar botão para aceitar/rejeitar convite */}
            </Text>
          ))}

          <Text color="$trueGray700" textAlign="center" mt="$4">
            Convites enviados
          </Text>

          {invitations?.sentInvites.length === 0 && (
            <Text color="$trueGray700">Nenhum convite enviado</Text>
          )}

          {invitations?.sentInvites.map((invite) => (
            <Text key={invite.id} color="$trueGray700">
              Convite enviado para: {invite.invitee_email}
              {/* Adicionar botão para excluir convite enviado */}
            </Text>
          ))}
        </Center>

        <Center flex={1} justifyContent="flex-end" mt="$4">
          <Button title="Convidar Parceiro" onPress={handleInvite} />
        </Center>
      </VStack>
    </ScrollView>
  )
}
