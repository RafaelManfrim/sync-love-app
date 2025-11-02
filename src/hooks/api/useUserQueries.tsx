import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@services/api'
import { useToast } from '@gluestack-ui/themed'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { translateApiError } from '@utils/translateApiError'

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
  const { t } = useTranslation()

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={t('hooks.userQueries.passwordSuccess')}
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
        ? translateApiError(error)
        : t('hooks.userQueries.passwordError')
      toast.show({
        placement: 'top',
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
  const { t } = useTranslation()

  return useMutation({
    mutationFn: updateUserName,
    onSuccess: async (_, variables) => {
      const userUpdated = JSON.parse(JSON.stringify(user))

      userUpdated.name = variables.name

      await updateUserProfile(userUpdated)

      await queryClient.invalidateQueries({ queryKey: ['userData'] })

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={t('hooks.userQueries.profileSuccess')}
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
        ? translateApiError(error)
        : t('hooks.userQueries.profileError')
      toast.show({
        placement: 'top',
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
  const { t } = useTranslation()

  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={t('hooks.userQueries.accountDeleteSuccess')}
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
        ? translateApiError(error)
        : t('hooks.userQueries.accountDeleteError')
      toast.show({
        placement: 'top',
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
