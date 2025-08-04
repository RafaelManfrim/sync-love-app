import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { Center, VStack, useToast } from '@gluestack-ui/themed'
import { AppError } from '@utils/AppError'
import { useState } from 'react'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useForm } from 'react-hook-form'
import { useAuth } from '@hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@services/api'

import * as zod from 'zod'
import { Button } from '@components/Button'

// const profileSchema = yup.object({
//   name: yup.string().required('Informe seu nome.'),
//   email: yup.string().required('Informe seu email.').email('Email inválido'),
//   old_password: yup.string().when('password', {
//     is: (Field: any) => Field,
//     then: (schema) => schema.nullable().required('Informe a senha antiga.'),
//   }),
//   password: yup
//     .string()
//     .min(6, 'A senha deve ter pelo menos 6 dígitos.')
//     .nullable()
//     .transform((value) => value || null),
//   confirm_password: yup
//     .string()
//     .nullable()
//     .transform((value) => value || null)
//     .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais.')
//     .when('password', {
//       is: (Field: any) => Field,
//       then: (schema) =>
//         schema.nullable().required('Informe a confirmação da senha.'),
//     }),
// })

// type FormDataProps = yup.InferType<typeof profileSchema>

const profileSchema = zod.object({})

type FormDataProps = zod.infer<typeof profileSchema>

export function Profile() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()

  const { control, handleSubmit, formState, resetField } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsSubmitting(true)

      const userUpdated = user

      await api.put('/users', data)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title="Perfil atualizado com sucesso!"
            onClose={() => toast.close(id)}
          />
        ),
      })

      userUpdated.name = data.name

      await updateUserProfile(userUpdated)

      resetField('old_password')
      resetField('password')
      resetField('confirm_password')
    } catch (error) {
      console.log(error)

      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o perfil'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoUri = photoSelected.assets[0].uri

      if (photoUri) {
        const fileInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number
        }

        if (fileInfo.size && fileInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande"
                description="Escolha uma de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        const fileExtension = photoUri.split('.').pop() as string

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoUri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const response = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action="success"
              title="Foto atualizada com sucesso!"
              onClose={() => toast.close(id)}
            />
          ),
        })

        const userUpdated = user
        userUpdated.avatar = response.data.avatar

        await updateUserProfile(userUpdated)
      }
    } catch (error) {
      console.log(error)

      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar a foto'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <VStack flex={1} p="$6" gap="$3"></VStack>

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Atualizar"
          onPress={handleProfileUpdate}
          isLoading={isSubmitting}
        />
      </Center>
    </VStack>
  )
}
