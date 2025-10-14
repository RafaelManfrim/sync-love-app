import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckIcon,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed'

type User = {
  name: string
  avatarUrl?: string
}

type Props = {
  title: string
  points: number
  category: string
  assignees: User[]
  isCompleted: boolean
  onToggle: () => void
}

export function MissionCard({
  title,
  points,
  category,
  assignees,
  isCompleted,
  onToggle,
}: Props) {
  return (
    <HStack
      bg="$gray500"
      p="$4"
      rounded="$md"
      mb="$3"
      alignItems="center"
      justifyContent="space-between"
      opacity={isCompleted ? 0.5 : 1}
    >
      <HStack alignItems="center" space="md">
        <Checkbox
          size="md"
          isChecked={isCompleted}
          onChange={onToggle}
          aria-label={title}
          value={title}
        >
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
        </Checkbox>
        <VStack>
          <Text
            color="$gray100"
            fontSize="$md"
            textDecorationLine={isCompleted ? 'line-through' : 'none'}
          >
            {title}
          </Text>
          <HStack space="sm" alignItems="center">
            <Text color="$green500" fontSize="$xs" fontWeight="$bold">
              +{points} pts
            </Text>
            <Text color="$gray300" fontSize="$xs">
              • {category}
            </Text>
          </HStack>
        </VStack>
      </HStack>

      <AvatarGroup>
        {assignees.map((user) => (
          <Avatar size="sm" key={user.name}>
            <AvatarFallbackText>{user.name}</AvatarFallbackText>
            {user.avatarUrl && (
              <AvatarImage source={{ uri: user.avatarUrl }} alt={user.name} />
            )}
          </Avatar>
        ))}
      </AvatarGroup>
    </HStack>
  )
}
