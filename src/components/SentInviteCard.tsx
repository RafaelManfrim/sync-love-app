import { Box, HStack, Icon, Text, VStack } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import {
  CheckCircleIcon,
  ClockIcon,
  MailIcon,
  TrashIcon,
  XCircleIcon,
} from 'lucide-react-native'
import { InviteDTO } from '@dtos/InviteDTO'
import { TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

interface SentInviteCardProps {
  invite: InviteDTO
  onDelete: (id: number) => void
}

export function SentInviteCard({ invite, onDelete }: SentInviteCardProps) {
  const { colors } = useTheme()
  const { t } = useTranslation()

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
      {/* Header com email e botão de deletar */}
      <HStack justifyContent="space-between" alignItems="center" mb="$2">
        <HStack alignItems="center" gap="$2" flex={1}>
          <Icon as={MailIcon} size="md" color={colors.primary500} />
          <Text
            color={colors.title}
            fontSize="$md"
            fontFamily="$heading"
            flex={1}
            numberOfLines={1}
          >
            {invite.invitee_email}
          </Text>
        </HStack>
        <TouchableOpacity onPress={() => onDelete(invite.id)}>
          <Icon as={TrashIcon} size="lg" color="$error500" />
        </TouchableOpacity>
      </HStack>

      {/* Status do convite */}
      {invite.rejected_at ? (
        <HStack alignItems="center" gap="$2" borderRadius="$md">
          <Icon as={XCircleIcon} size="sm" color="$error500" />
          <VStack flex={1}>
            <Text color="$error500" fontSize="$sm" fontWeight="$bold">
              {t('components.sentInviteCard.rejected')}{' '}
              <Text color="$error500" fontSize="$xs">
                {t('components.sentInviteCard.on')}{' '}
                {new Date(invite.rejected_at).toLocaleDateString()}{' '}
                {t('components.sentInviteCard.at')}{' '}
                {new Date(invite.rejected_at).toLocaleTimeString()}
              </Text>
            </Text>
          </VStack>
        </HStack>
      ) : invite.accepted_at ? (
        <HStack alignItems="center" gap="$2" borderRadius="$md">
          <Icon as={CheckCircleIcon} size="sm" color="$success500" />
          <VStack flex={1}>
            <Text color="$success500" fontSize="$sm" fontWeight="$bold">
              {t('components.sentInviteCard.accepted')}{' '}
              <Text color="$success500" fontSize="$xs">
                {t('components.sentInviteCard.on')}{' '}
                {new Date(invite.accepted_at).toLocaleDateString()}{' '}
                {t('components.sentInviteCard.at')}{' '}
                {new Date(invite.accepted_at).toLocaleTimeString()}
              </Text>
            </Text>
          </VStack>
        </HStack>
      ) : (
        <HStack alignItems="center" gap="$2" borderRadius="$md">
          <Icon as={ClockIcon} size="sm" color={colors.primary500} />
          <VStack flex={1}>
            <Text color={colors.text} fontSize="$sm" fontWeight="$bold">
              {t('components.sentInviteCard.waiting')}
            </Text>
            <Text color={colors.textInactive} fontSize="$xs">
              {t('components.sentInviteCard.sentAt')}{' '}
              {new Date(invite.invited_at).toLocaleDateString()}{' '}
              {t('components.sentInviteCard.at')}{' '}
              {new Date(invite.invited_at).toLocaleTimeString()}
            </Text>
          </VStack>
        </HStack>
      )}
    </Box>
  )
}
