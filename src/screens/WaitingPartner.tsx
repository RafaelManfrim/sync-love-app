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
import { MailIcon } from 'lucide-react-native'
import { Loading } from '@components/Loading'
import {
  useAcceptInvite,
  useDeleteInvite,
  useInvitations,
  useRejectInvite,
} from '@hooks/api/useInvitationQueries'
import { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { RecievedInviteCard } from '@components/RecievedInviteCard'
import { SentInviteCard } from '@components/SentInviteCard'
import { useTranslation } from 'react-i18next'

export function WaitingPartner() {
  const { colors } = useTheme()
  const { t } = useTranslation()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitations])

  return (
    <VStack flex={1} px="$8" pb="$16">
      <Center my="$16">
        <Image
          source={Logo}
          defaultSource={Logo}
          alt={t('waitingPartner.logoAlt')}
        />

        <Text color={colors.text} fontSize="$sm" textAlign="center">
          {t('waitingPartner.subtitle')}
        </Text>
      </Center>

      <Center mb="$2">
        <Heading color={colors.title}>{t('waitingPartner.title')}</Heading>
      </Center>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Convites Recebidos */}
        <VStack mb="$6" gap="$3">
          <HStack alignItems="center" gap="$2" mb="$2">
            <Icon as={MailIcon} size="lg" color={colors.primary500} />
            <Text color={colors.title} fontSize="$lg" fontFamily="$heading">
              {t('waitingPartner.receivedInvites')}
            </Text>
          </HStack>

          {invitations?.recievedInvites.length === 0 ? (
            <Box
              p="$6"
              bg={colors.card}
              borderRadius="$lg"
              borderWidth={1}
              borderColor={colors.border}
            >
              <Center gap="$2">
                <Icon as={MailIcon} size="xl" color={colors.textInactive} />
                <Text color={colors.textInactive} textAlign="center">
                  {t('waitingPartner.noReceivedInvites')}
                </Text>
                <Text
                  color={colors.textInactive}
                  fontSize="$sm"
                  textAlign="center"
                  opacity={0.7}
                >
                  {t('waitingPartner.noReceivedInvitesDescription')}
                </Text>
              </Center>
            </Box>
          ) : (
            invitations?.recievedInvites.map((invite) => (
              <RecievedInviteCard
                key={invite.id}
                invite={invite}
                onAccept={acceptInvite}
                onReject={rejectInvite}
              />
            ))
          )}

          {isLoadingSomething && (
            <Center py="$4">
              <Loading />
            </Center>
          )}
        </VStack>

        {/* Seção de Convites Enviados */}
        <VStack gap="$3">
          <HStack alignItems="center" gap="$2" mb="$2">
            <Icon as={MailIcon} size="lg" color={colors.primary500} />
            <Text color={colors.title} fontSize="$lg" fontFamily="$heading">
              {t('waitingPartner.sentInvites')}
            </Text>
          </HStack>

          {invitations?.sentInvites.length === 0 ? (
            <Box
              p="$6"
              bg={colors.card}
              borderRadius="$lg"
              borderWidth={1}
              borderColor={colors.border}
            >
              <Center gap="$2">
                <Icon as={MailIcon} size="xl" color={colors.textInactive} />
                <Text color={colors.textInactive} textAlign="center">
                  {t('waitingPartner.noSentInvites')}
                </Text>
                <Text
                  color={colors.textInactive}
                  fontSize="$sm"
                  textAlign="center"
                  opacity={0.7}
                >
                  {t('waitingPartner.noSentInvitesDescription')}
                </Text>
              </Center>
            </Box>
          ) : (
            invitations?.sentInvites.map((invite) => (
              <SentInviteCard
                key={invite.id}
                invite={invite}
                onDelete={deleteInvite}
              />
            ))
          )}
        </VStack>
      </ScrollView>

      <Center mt="$8">
        <Button
          title={t('waitingPartner.inviteButton')}
          onPress={handleInvite}
        />
      </Center>
    </VStack>
  )
}
