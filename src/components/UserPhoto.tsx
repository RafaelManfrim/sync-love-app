import { Image } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ComponentProps } from 'react'

type UserPhotoProps = ComponentProps<typeof Image>

export function UserPhoto({ ...rest }: UserPhotoProps) {
  const { colors } = useTheme()

  return (
    <Image
      rounded="$full"
      borderWidth="$2"
      borderColor={colors.border}
      bg={colors.background}
      alt="Foto de perfil do usuário"
      {...rest}
    />
  )
}
