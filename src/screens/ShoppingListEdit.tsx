import { useEffect } from 'react'
import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import {
  Center,
  FormControlLabel,
  FormControlLabelText,
  KeyboardAvoidingView,
  useToast,
  VStack,
  FormControl,
} from '@gluestack-ui/themed'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ShoppingListNavigationRoutesProps } from '@routes/lists.routes'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Platform } from 'react-native'
import { useTheme } from '@hooks/useTheme'
import { useTranslation } from 'react-i18next'
import { translateApiError } from '@utils/translateApiError'
import { useShoppingListQueries } from '@hooks/api/useShoppingListQueries'
import { Loading } from '@components/Loading'

type EditShoppingListRouteParams = {
  shoppingListId: number
}

export function ShoppingListEdit() {
  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()
  const route = useRoute()
  const toast = useToast()

  const { colors } = useTheme()
  const { t } = useTranslation()

  const { shoppingListId } = route.params as EditShoppingListRouteParams

  const { useFetchShoppingListDetails, useUpdateShoppingList } =
    useShoppingListQueries()
  const { data: shoppingList, isLoading: isLoadingList } =
    useFetchShoppingListDetails(shoppingListId)
  const { mutate: updateList, isPending } = useUpdateShoppingList()

  const editShoppingListSchema = z.object({
    title: z
      .string()
      .min(3, { message: t('shoppingListEdit.titleMinLength') })
      .max(30, { message: t('shoppingListEdit.titleMaxLength') }),
  })

  type EditShoppingListFormData = z.infer<typeof editShoppingListSchema>

  const { control, handleSubmit, formState, setValue } =
    useForm<EditShoppingListFormData>({
      resolver: zodResolver(editShoppingListSchema),
    })

  // Preenche o formulário com os dados da lista
  useEffect(() => {
    if (shoppingList) {
      setValue('title', shoppingList.name)
    }
  }, [shoppingList, setValue])

  async function handleUpdate(data: EditShoppingListFormData) {
    updateList(
      { listId: shoppingListId, name: data.title },
      {
        onSuccess: () => {
          toast.show({
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title={t('shoppingListEdit.updateSuccess')}
                action="success"
                onClose={() => toast.close(id)}
              />
            ),
            placement: 'top',
          })
          navigation.goBack()
        },
        onError: (error) => {
          const description = translateApiError(
            error as { code?: string; message?: string },
          )

          toast.show({
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title={t('shoppingListEdit.updateError')}
                description={description}
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
            placement: 'top',
          })
        },
      },
    )
  }

  if (isLoadingList) {
    return <Loading />
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('shoppingListEdit.title')} hasGoBackButton />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack p="$6" flex={1} justifyContent="space-between">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('shoppingListEdit.nameLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={t('shoppingListEdit.namePlaceholder')}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={formState.errors?.title?.message}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(handleUpdate)}
                />
              )}
            />
          </FormControl>
        </VStack>
        <Center w="$full" gap="$3" p="$6">
          <Button
            title={t('shoppingListEdit.updateButton')}
            onPress={handleSubmit(handleUpdate)}
            isLoading={isPending}
          />
        </Center>
      </KeyboardAvoidingView>
    </VStack>
  )
}
