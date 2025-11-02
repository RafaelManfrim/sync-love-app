import {
  ButtonSpinner,
  Button as GluestackButton,
  Text,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { colors } = useTheme()
  const { t } = useTranslation()

  return (
    <GluestackButton
      w="$full"
      h="$12"
      bg={variant === 'outline' ? 'transparent' : colors.primary700}
      borderWidth={variant === 'outline' ? '$1' : '$0'}
      borderColor={colors.primary500}
      rounded="$md"
      $active-bg={variant === 'outline' ? colors.background : colors.primary500}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner
          color={colors.textContrast}
          accessibilityLabel={t('components.button.loading')}
        />
      ) : (
        <Text
          color={
            variant === 'outline' ? colors.primary500 : colors.textContrast
          }
          fontFamily="$heading"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  )
}
