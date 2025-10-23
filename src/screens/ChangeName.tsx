import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { Center, KeyboardAvoidingView, VStack } from '@gluestack-ui/themed'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateUserName } from '@hooks/api/useUserQueries'
import { useAuth } from '@hooks/useAuth'
import { Controller, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import z from 'zod'

const changeNameSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
})

type ChangeNameFormData = z.infer<typeof changeNameSchema>

export function ChangeName() {
  const { user } = useAuth()

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
      <ScreenHeader title="Alterar nome" hasGoBackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack flex={1} p="$6" gap="$3">
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={formState.errors?.name?.message}
                onSubmitEditing={handleSubmit(handleUpdateName)}
                returnKeyType="done"
              />
            )}
          />
        </VStack>

        <Center w="$full" gap="$4" p="$6">
          <Button
            title="Atualizar"
            onPress={handleSubmit(handleUpdateName)}
            isLoading={isPending}
          />
        </Center>
      </KeyboardAvoidingView>
    </VStack>
  )
}
