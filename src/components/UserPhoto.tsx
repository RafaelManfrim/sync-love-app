import { Image } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type UserPhotoProps = ComponentProps<typeof Image>

export function UserPhoto({ ...rest }: UserPhotoProps) {
  return (
    <Image
      rounded="$full"
      borderWidth="$2"
      borderColor="$trueGray400"
      bg="$trueGray500"
      alt="Foto de perfil do usuário"
      {...rest}
    />
  )
}
