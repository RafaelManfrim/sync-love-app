import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import {
  FormControlLabelText,
  Center,
  FormControl,
  FormControlLabel,
  KeyboardAvoidingView,
  VStack,
} from '@gluestack-ui/themed'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateUserName } from '@hooks/api/useUserQueries'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { Controller, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import z from 'zod'

export function ChangeName() {
  const { user } = useAuth()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const changeNameSchema = z.object({
    name: z.string().min(1, t('changeName.nameRequired')),
  })

  type ChangeNameFormData = z.infer<typeof changeNameSchema>

  const { mutate: updateName, isPending } = useUpdateUserName()

  const { control, handleSubmit, formState } = useForm<ChangeNameFormData>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: { name: user?.name || '' },
  })

  function handleUpdateName(data: ChangeNameFormData) {
    updateName({ name: data.name })
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('changeName.title')} hasGoBackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack flex={1} p="$6" gap="$3">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('changeName.nameLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder={t('changeName.namePlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={formState.errors?.name?.message}
                  onSubmitEditing={handleSubmit(handleUpdateName)}
                  returnKeyType="done"
                />
              )}
            />
          </FormControl>
        </VStack>

        <Center w="$full" gap="$4" p="$6">
          <Button
            title={t('changeName.updateButton')}
            onPress={handleSubmit(handleUpdateName)}
            isLoading={isPending}
          />
        </Center>
      </KeyboardAvoidingView>
    </VStack>
  )
}
