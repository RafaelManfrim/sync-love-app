import { InviteDTO } from '@dtos/InviteDTO'
import { Box, HStack, Icon, Text, VStack } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ClockIcon, UserPlusIcon } from 'lucide-react-native'
import { Button } from './Button'
import { UserPhoto } from './UserPhoto'
import { api } from '@services/api'

interface RecievedInviteCardProps {
  invite: InviteDTO
  onAccept: (id: number) => void
  onReject: (id: number) => void
}

export function RecievedInviteCard({
  invite,
  onAccept,
  onReject,
}: RecievedInviteCardProps) {
  const { colors } = useTheme()

  return (
    <Box
      key={invite.id}
      p="$4"
      bg={colors.card}
      borderRadius="$lg"
      borderWidth={1}
      borderColor={colors.border}
      shadowColor={colors.primary500}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
    >
      {/* Informações do remetente */}
      <VStack mb="$2">
        <HStack alignItems="center" gap="$2">
          <Icon as={UserPlusIcon} size="md" color={colors.primary500} />
          <HStack flex={1} justifyContent="space-between" alignItems="center">
            <Text color={colors.title} fontSize="$lg" fontFamily="$heading">
              {invite.inviter.name}
            </Text>

            {invite.inviter.avatar_url && (
              <UserPhoto
                source={{
                  uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${invite.inviter.avatar_url}`,
                }}
                w="$6"
                h="$6"
                alt={`Foto de perfil do autor da lista: ${invite.inviter.name}`}
                size="xl"
              />
            )}
          </HStack>
        </HStack>
        <Text color={colors.text} fontSize="$sm">
          {invite.inviter.email}
        </Text>
      </VStack>

      {/* Data do convite */}
      <HStack alignItems="center" gap="$2" mb="$3">
        <Icon as={ClockIcon} size="xs" color={colors.textInactive} />
        <Text color={colors.textInactive} fontSize="$xs">
          Recebido em {new Date(invite.invited_at).toLocaleDateString()} às{' '}
          {new Date(invite.invited_at).toLocaleTimeString()}
        </Text>
      </HStack>

      {/* Botões de Ação */}
      <HStack gap="$3">
        <Button
          flex={1}
          title="Recusar"
          variant="outline"
          onPress={() => onReject(invite.id)}
          h="$12"
        />
        <Button
          flex={1}
          title="Aceitar"
          onPress={() => onAccept(invite.id)}
          h="$12"
        />
      </HStack>
    </Box>
  )
}
