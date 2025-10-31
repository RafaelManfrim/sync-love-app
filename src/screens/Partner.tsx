import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { format } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import {
  useCoupleDetails,
  useEndRelationship,
} from '@hooks/api/useCoupleQueries'
import { useTheme } from '@hooks/useTheme'
import { api } from '@services/api'

export function Partner() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const { colors } = useTheme()
  const { t } = useTranslation()

  const { data: coupleDetails, isLoading } = useCoupleDetails()
  const { mutate: endRelationship, isPending: isSubmitting } =
    useEndRelationship()

  async function handleEndRelationship() {
    endRelationship()
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('partner.title')} />

      {!isLoading && coupleDetails ? (
        <>
          <VStack flex={1} p="$6" gap="$3">
            <HStack
              w="$full"
              bgColor={colors.card}
              alignItems="center"
              p="$3"
              borderRadius="$md"
            >
              <UserPhoto
                source={
                  coupleDetails.partner.avatar_url
                    ? {
                        uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${coupleDetails.partner.avatar_url}`,
                      }
                    : DefaultUserPhoto
                }
                w="$12"
                h="$12"
                alt={t('partner.userPhotoAlt')}
                size="xl"
              />

              <VStack pl="$3" mr="auto">
                <Text color={colors.title}>{coupleDetails.partner.name}</Text>
                <Text color={colors.text} fontSize="$sm">
                  {coupleDetails.partner.email}
                </Text>
              </VStack>
            </HStack>

            <VStack w="$full" bgColor={colors.card} p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={colors.text} fontSize="$sm">
                  {t('partner.togetherSince')}
                </Text>
                <Text fontWeight="bold" color={colors.primary500}>
                  {format(
                    new Date(coupleDetails.togetherSince || 0),
                    'dd/MM/yyyy',
                  )}
                </Text>
              </HStack>
            </VStack>
            <VStack w="$full" bgColor={colors.card} p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={colors.text} fontSize="$sm">
                  {t('partner.lists')}
                </Text>
                <Text fontWeight="bold" color={colors.primary500}>
                  {coupleDetails.listsCreated ?? 0}
                </Text>
              </HStack>
            </VStack>
            <VStack w="$full" bgColor={colors.card} p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={colors.text} fontSize="$sm">
                  {t('partner.tasksCreated')}
                </Text>
                <Text fontWeight="bold" color={colors.primary500}>
                  {coupleDetails.totalTasksCreated ?? 0}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={colors.text} fontSize="$sm">
                  {t('partner.completedByYou')}
                </Text>
                <Text fontWeight="bold" color={colors.primary500}>
                  {coupleDetails.taskCompletionSummary?.me ?? 0}
                </Text>
              </HStack>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={colors.text} fontSize="$sm">
                  {t('partner.completedByPartner', {
                    partnerName: coupleDetails.partner.name,
                  })}
                </Text>
                <Text fontWeight="bold" color={colors.primary500}>
                  {coupleDetails.taskCompletionSummary?.partner ?? 0}
                </Text>
              </HStack>
            </VStack>
            <VStack w="$full" bgColor={colors.card} p="$4" borderRadius="$md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={colors.text} fontSize="$sm">
                  {t('partner.importantDates')}
                </Text>
                <Text fontWeight="bold" color={colors.primary500}>
                  {coupleDetails.totalCalendarEventsCreated ?? 0}
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <Center w="$full" gap="$3" p="$6">
            <Button
              title={t('partner.endRelationshipButton')}
              onPress={() => setShowConfirmDialog(true)}
              variant="outline"
            />
          </Center>
          <AlertDialog
            isOpen={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
          >
            <AlertDialogBackdrop />
            <AlertDialogContent bg={colors.card}>
              <AlertDialogHeader>
                <Heading color={colors.title}>
                  {t('partner.confirmTitle')}
                </Heading>
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text color={colors.text}>{t('partner.confirmMessage')}</Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <ButtonGroup space="lg">
                  <Pressable
                    onPress={() => setShowConfirmDialog(false)}
                    p="$2"
                    borderRadius="$md"
                  >
                    <Text color={colors.textInactive} fontWeight="$medium">
                      {t('partner.cancel')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleEndRelationship}
                    disabled={isSubmitting}
                    p="$2"
                    borderRadius="$md"
                    bg={isSubmitting ? '$trueGray200' : '$red50'}
                    $hover-bg="$red100"
                  >
                    <Text
                      color={isSubmitting ? '$trueGray500' : '$error500'}
                      fontWeight="$semibold"
                    >
                      {isSubmitting
                        ? t('partner.ending')
                        : t('partner.confirmEnd')}
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
