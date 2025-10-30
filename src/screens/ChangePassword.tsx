import { Button } from '@components/Button'
import { PasswordInput } from '@components/PasswordInput'
import { ScreenHeader } from '@components/ScreenHeader'
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  KeyboardAvoidingView,
  Center,
  VStack,
} from '@gluestack-ui/themed'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdatePassword } from '@hooks/api/useUserQueries'
import { useTheme } from '@hooks/useTheme'
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
  const { colors } = useTheme()

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
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                Senha antiga
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field: { onChange } }) => (
                <PasswordInput
                  placeholder="Senha antiga"
                  onChangeText={onChange}
                  errorMessage={formState.errors?.oldPassword?.message}
                />
              )}
            />
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                Senha nova
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { onChange } }) => (
                <PasswordInput
                  placeholder="Nova senha"
                  onChangeText={onChange}
                  errorMessage={formState.errors?.newPassword?.message}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                Confirme a nova senha
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange } }) => (
                <PasswordInput
                  placeholder="Confirme a nova senha"
                  onChangeText={onChange}
                  errorMessage={formState.errors?.confirmPassword?.message}
                />
              )}
            />
          </FormControl>
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
