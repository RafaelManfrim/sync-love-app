import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import {
  Center,
  KeyboardAvoidingView,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { HomeNavigationRoutesProps } from '@routes/lists.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useState } from 'react'
import { Platform } from 'react-native'

const newShoppingListSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
    .max(30, { message: 'O título deve ter no máximo 30 caracteres.' }),
})

type NewShoppingListFormData = z.infer<typeof newShoppingListSchema>

export function NewShoppingList() {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<HomeNavigationRoutesProps>()
  const toast = useToast()

  const { control, handleSubmit, formState } = useForm<NewShoppingListFormData>(
    {
      resolver: zodResolver(newShoppingListSchema),
    },
  )

  async function handleCreate(data: NewShoppingListFormData) {
    try {
      setIsLoading(true)
      await api.post('/shopping-lists', { title: data.title })

      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Lista de compras criada com sucesso!"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
        placement: 'top',
      })
      navigation.goBack()
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível criar a lista de compras.'

      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
        placement: 'top',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Nova Lista de Compras" hasGoBackButton />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack p="$6" mt="$5" flex={1} justifyContent="space-between">
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Título da lista"
                onChangeText={onChange}
                value={value}
                errorMessage={formState.errors?.title?.message}
                returnKeyType="send"
                onSubmitEditing={handleSubmit(handleCreate)}
              />
            )}
          />
        </VStack>
        <Center w="$full" gap="$3" p="$6">
          <Button
            title="Criar"
            onPress={handleSubmit(handleCreate)}
            isLoading={isLoading}
          />
        </Center>
      </KeyboardAvoidingView>
    </VStack>
  )
}
