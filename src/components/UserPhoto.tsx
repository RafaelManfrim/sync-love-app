import { Image } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

type UserPhotoProps = ComponentProps<typeof Image>

export function UserPhoto({ ...rest }: UserPhotoProps) {
  const { colors } = useTheme()
  const { t } = useTranslation()

  return (
    <Image
      rounded="$full"
      borderWidth="$2"
      borderColor={colors.border}
      bg={colors.background}
      alt={t('components.userPhoto.alt')}
      {...rest}
    />
  )
}
