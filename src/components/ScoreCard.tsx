import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Heading,
  Progress,
  ProgressFilledTrack,
  Text,
  VStack,
} from '@gluestack-ui/themed'

type Props = {
  currentPoints: number
  goalPoints: number
  reward: string
  user1: { name: string; score: number; avatarUrl?: string }
  user2: { name: string; score: number; avatarUrl?: string }
}

export function ScoreCard({
  currentPoints,
  goalPoints,
  reward,
  user1,
  user2,
}: Props) {
  const progressValue = (currentPoints / goalPoints) * 100

  return (
    <VStack bg="$trueGray200" p="$4" rounded="$md" mb="$5">
      <VStack>
        <HStack justifyContent="space-between" alignItems="center" mb="$1">
          <Heading color="$trueGray700" fontSize="$md">
            Placar do Mês
          </Heading>
          <Text color="$red500" fontSize="$sm" fontWeight="$bold">
            {currentPoints} / {goalPoints} pts
          </Text>
        </HStack>
        <Progress value={progressValue} w="100%" h="$2">
          <ProgressFilledTrack bg="$red500" />
        </Progress>
        <Text color="$trueGray500" fontSize="$xs" mt="$1">
          recompensa: {reward}
        </Text>
      </VStack>

      <HStack justifyContent="space-between" pt="$4">
        <HStack alignItems="center" space="sm">
          <Avatar size="sm">
            <AvatarFallbackText>{user1.name}</AvatarFallbackText>
            {user1.avatarUrl && (
              <AvatarImage source={{ uri: user1.avatarUrl }} alt={user1.name} />
            )}
          </Avatar>
          <VStack>
            <Text color="$red500" fontWeight="$bold" fontSize="$sm">
              {user1.name}
            </Text>
            <Text color="$red500" fontSize="$xs">
              {user1.score} pts
            </Text>
          </VStack>
        </HStack>
        <HStack alignItems="center" space="sm">
          <VStack>
            <Text
              color="$red500"
              fontWeight="$bold"
              fontSize="$sm"
              textAlign="right"
            >
              {user2.name}
            </Text>
            <Text color="$red500" fontSize="$xs" textAlign="right">
              {user2.score} pts
            </Text>
          </VStack>
          <Avatar size="sm">
            <AvatarFallbackText>{user2.name}</AvatarFallbackText>
            {user2.avatarUrl && (
              <AvatarImage source={{ uri: user2.avatarUrl }} alt={user2.name} />
            )}
          </Avatar>
        </HStack>
      </HStack>
    </VStack>
  )
}
