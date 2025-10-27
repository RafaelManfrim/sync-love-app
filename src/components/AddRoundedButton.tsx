import { Fab, FabIcon, AddIcon } from '@gluestack-ui/themed'
import { PressableProps } from 'react-native'
import { useTheme } from '@hooks/useTheme'

interface AddRoundedButtonProps extends PressableProps {}

export function AddRoundedButton({ ...rest }: AddRoundedButtonProps) {
  const { colors } = useTheme()

  return (
    <Fab
      size="lg"
      placement="bottom right"
      bg={colors.primary500}
      $active-bg={colors.primary600}
      // $active-bg={colors.primaryDark}
      {...rest}
    >
      <FabIcon as={AddIcon} />
    </Fab>
  )
}
