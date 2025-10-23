import { Center, Spinner } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'

export function Loading() {
  const { colors } = useTheme()

  return (
    <Center flex={1} bg={colors.background}>
      <Spinner color={colors.primary500} />
    </Center>
  )
}
