import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@services/api'
import { useToast } from '@gluestack-ui/themed'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@hooks/useAuth'

type UpdatePasswordParams = {
  oldPassword: string
  newPassword: string
}

async function updatePassword({
  oldPassword,
  newPassword,
}: UpdatePasswordParams) {
  await api.patch('/users/password', { oldPassword, newPassword })
}

export function useUpdatePassword() {
  const toast = useToast()
  const navigation = useNavigation()

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Senha atualizada com sucesso!"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      })
      navigation.goBack()
    },
    onError: (error) => {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar a senha.'
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    },
  })
}

async function updateUserName(variables: { name: string }) {
  await api.patch('/users', { newName: variables.name })
}

export function useUpdateUserName() {
  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  return useMutation({
    mutationFn: updateUserName,
    onSuccess: async (_, variables) => {
      const userUpdated = JSON.parse(JSON.stringify(user))

      userUpdated.name = variables.name

      await updateUserProfile(userUpdated)

      await queryClient.invalidateQueries({ queryKey: ['userData'] })

      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Nome atualizado com sucesso!"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      })

      navigation.goBack()
    },
    onError: (error) => {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o nome.'
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    },
  })
}

async function deleteUserAccount() {
  await api.delete('/users/me')
}

export function useDeleteAccount() {
  const toast = useToast()
  const { signOut } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: async () => {
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Conta excluída com sucesso."
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      })
      // Limpa todo o cache e faz logout
      queryClient.clear()
      await signOut()
    },
    onError: (error) => {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível excluir a conta.'
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      })
    },
  })
}
