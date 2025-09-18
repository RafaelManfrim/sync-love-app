import {
  ButtonSpinner,
  Button as GluestackButton,
  Text,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type ButtonProps = ComponentProps<typeof GluestackButton> & {
  title: string
  variant?: 'solid' | 'outline'
  isLoading?: boolean
}

export function Button({
  title,
  variant = 'solid',
  isLoading = false,
  ...rest
}: ButtonProps) {
  return (
    <GluestackButton
      w="$full"
      h="$12"
      bg={variant === 'outline' ? 'transparent' : '$red700'}
      borderWidth={variant === 'outline' ? '$1' : '$0'}
      borderColor="$red500"
      rounded="$md"
      $active-bg={variant === 'outline' ? '$trueGray100' : '$red500'}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" accessibilityLabel="Carregando" />
      ) : (
        <Text
          color={variant === 'outline' ? '$red500' : '$white'}
          fontFamily="$heading"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}
