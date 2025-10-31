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
import { useTranslation } from 'react-i18next'
import z from 'zod'

export function ChangePassword() {
  const { colors } = useTheme()
  const { t } = useTranslation()

  const changePasswordSchema = z
    .object({
      oldPassword: z.string().min(1, t('changePassword.oldPasswordRequired')),
      newPassword: z.string().min(6, t('changePassword.newPasswordMinLength')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('changePassword.confirmPasswordMismatch'),
      path: ['confirmPassword'],
    })

  type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

  const { mutate: updatePassword, isPending } = useUpdatePassword()

  const { control, handleSubmit, formState } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  function handleUpdatePassword(data: ChangePasswordFormData) {
    updatePassword(data)
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('changePassword.title')} hasGoBackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack flex={1} p="$6" gap="$3">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('changePassword.oldPasswordLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field: { onChange } }) => (
                <PasswordInput
                  placeholder={t('changePassword.oldPasswordPlaceholder')}
                  onChangeText={onChange}
                  errorMessage={formState.errors?.oldPassword?.message}
                />
              )}
            />
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('changePassword.newPasswordLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { onChange } }) => (
                <PasswordInput
                  placeholder={t('changePassword.newPasswordPlaceholder')}
                  onChangeText={onChange}
                  errorMessage={formState.errors?.newPassword?.message}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('changePassword.confirmPasswordLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange } }) => (
                <PasswordInput
                  placeholder={t('changePassword.confirmPasswordPlaceholder')}
                  onChangeText={onChange}
                  errorMessage={formState.errors?.confirmPassword?.message}
                />
              )}
            />
          </FormControl>
        </VStack>

        <Center w="$full" gap="$4" p="$6">
          <Button
            title={t('changePassword.updateButton')}
            onPress={handleSubmit(handleUpdatePassword)}
            isLoading={isPending}
          />
        </Center>
      </KeyboardAvoidingView>
    </VStack>
  )
}
