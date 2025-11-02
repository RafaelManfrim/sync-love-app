import {
  HStack,
  Heading,
  Progress,
  ProgressFilledTrack,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { UserPhoto } from './UserPhoto'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { api } from '@services/api'
import { useTranslation } from 'react-i18next'

type Props = {
  currentPoints: number
  goalPoints: number
  me: { name: string; score: number; avatarUrl?: string }
  partner: { name: string; score: number; avatarUrl?: string }
}

export function ScoreCard({ currentPoints, goalPoints, me, partner }: Props) {
  const { colors } = useTheme()
  const { t } = useTranslation()

  const progressValue = (currentPoints / goalPoints) * 100

  return (
    <VStack bg={colors.card} p="$4" rounded="$md" mb="$5">
      <VStack>
        <HStack justifyContent="space-between" alignItems="center" mb="$1">
          <Heading color={colors.title} fontSize="$md">
            {t('components.scoreCard.monthlyScore')}
          </Heading>
          <Text color={colors.primary500} fontSize="$sm" fontWeight="$bold">
            {currentPoints} / {goalPoints} {t('components.scoreCard.tasks')}
          </Text>
        </HStack>
        <Progress value={progressValue} w="100%" h="$2">
          <ProgressFilledTrack bg={colors.primary500} />
        </Progress>
      </VStack>

      <HStack justifyContent="space-between" pt="$4">
        <HStack alignItems="center" space="sm">
          <UserPhoto
            w="$8"
            h="$8"
            source={
              me.avatarUrl
                ? {
                    uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${me.avatarUrl}`,
                  }
                : DefaultUserPhoto
            }
          />
          <VStack>
            <Text color={colors.primary500} fontWeight="$bold" fontSize="$sm">
              {me.name}
            </Text>
            <Text color={colors.primary500} fontSize="$xs">
              {me.score} {t('components.scoreCard.tasks')}
            </Text>
          </VStack>
        </HStack>
        <HStack alignItems="center" space="sm">
          <VStack>
            <Text
              color={colors.primary500}
              fontWeight="$bold"
              fontSize="$sm"
              textAlign="right"
            >
              {partner.name}
            </Text>
            <Text color={colors.primary500} fontSize="$xs" textAlign="right">
              {partner.score} {t('components.scoreCard.tasks')}
            </Text>
          </VStack>
          <UserPhoto
            w="$8"
            h="$8"
            source={
              partner.avatarUrl
                ? {
                    uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${partner.avatarUrl}`,
                  }
                : DefaultUserPhoto
            }
          />
        </HStack>
      </HStack>
    </VStack>
  )
}
