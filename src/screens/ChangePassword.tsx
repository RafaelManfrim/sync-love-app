import { Button } from '@components/Button'
import { PasswordInput } from '@components/PasswordInput'
import { ScreenHeader } from '@components/ScreenHeader'
import { KeyboardAvoidingView, Center, VStack } from '@gluestack-ui/themed'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdatePassword } from '@hooks/api/useUserQueries'
import { Controller, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import z from 'zod'

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Informe a senha antiga.'),
    newPassword: z
      .string()
      .min(6, 'A nova senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'A confirmação de senha não confere.',
    path: ['confirmPassword'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export function ChangePassword() {
  const { mutate: updatePassword, isPending } = useUpdatePassword()

  const { control, handleSubmit, formState } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  function handleUpdatePassword(data: ChangePasswordFormData) {
    updatePassword(data)
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Alterar a senha" hasGoBackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack flex={1} p="$6" gap="$3">
          <Controller
            name="oldPassword"
            control={control}
            render={({ field: { onChange } }) => (
              <PasswordInput
                placeholder="Senha antiga"
                bg="$gray600"
                onChangeText={onChange}
                errorMessage={formState.errors?.oldPassword?.message}
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field: { onChange } }) => (
              <PasswordInput
                placeholder="Nova senha"
                bg="$gray600"
                onChangeText={onChange}
                errorMessage={formState.errors?.newPassword?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange } }) => (
              <PasswordInput
                placeholder="Confirme a nova senha"
                bg="$gray600"
                onChangeText={onChange}
                errorMessage={formState.errors?.confirmPassword?.message}
              />
            )}
          />
        </VStack>

        <Center w="$full" gap="$4" p="$6">
          <Button
            title="Atualizar"
            onPress={handleSubmit(handleUpdatePassword)}
            isLoading={isPending}
          />
        </Center>
      </KeyboardAvoidingView>
    </VStack>
  )
}
