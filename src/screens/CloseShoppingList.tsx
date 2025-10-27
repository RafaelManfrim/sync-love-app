import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import {
  Text,
  FlatList,
  HStack,
  VStack,
  useToast,
  InputField,
  Input,
  KeyboardAvoidingView,
} from '@gluestack-ui/themed'
import { zodResolver } from '@hookform/resolvers/zod'
import { useShoppingListQueries } from '@hooks/api/useShoppingListQueries'
import { useTheme } from '@hooks/useTheme'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {
  ShoppingListNavigationRoutesProps,
  ShoppingListScreenProps,
} from '@routes/lists.routes'
import { formatCurrencyMask } from '@utils/formatCurrencyMask'
import { zFormattedNumber } from '@utils/zFormattedNumber'
import { useCallback, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import z from 'zod'

const itemSchema = z.object({
  itemId: z.number(),
  unitPrice: zFormattedNumber({ message: 'Informe o valor unitário' }),
  name: z.string(),
})

const closeListFormSchema = z.object({
  items: z.array(itemSchema),
})

type FormData = z.infer<typeof closeListFormSchema>

type Field = {
  id: number
  itemId: number
  unitPrice: number | string | unknown
  name: string
}

export function CloseShoppingList() {
  const { colors } = useTheme()

  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()
  const route = useRoute()
  const toast = useToast()
  const { shoppingListId } = route.params as ShoppingListScreenProps

  const { useFetchShoppingListDetails, useCloseShoppingList } =
    useShoppingListQueries()

  const {
    data: shoppingList,
    isLoading,
    // isRefetching,
    refetch,
    // error,
  } = useFetchShoppingListDetails(shoppingListId)

  const { mutateAsync: closeShoppingList } = useCloseShoppingList()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(closeListFormSchema),
    defaultValues: {
      items: [],
    },
  })

  const { fields, replace } = useFieldArray({
    control,
    name: 'items',
  })

  async function handleCloseShoppingList(data: FormData) {
    const apiPayload = data.items.map((item) => ({
      shoppingItemId: item.itemId,
      unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : 0,
    }))

    try {
      closeShoppingList({ listId: shoppingListId, items: apiPayload })

      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            action="success"
            title="Lista de compras finalizada com sucesso!"
          />
        ),
        placement: 'top',
      })

      navigation.navigate('shoppingLists')
    } catch (error) {
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            action="error"
            title="Erro ao fechar a lista"
          />
        ),
        placement: 'top',
      })
    }
  }

  useEffect(() => {
    if (shoppingList) {
      const checkedItems = shoppingList.ShoppingListItem.filter(
        (item) => item.is_checked,
      ).map((item) => ({
        itemId: item.id,
        unitPrice: 0,
        name: item.product.name,
      }))
      replace(checkedItems)
    }
  }, [shoppingList, replace])

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Fechar Lista de Compras" hasGoBackButton />

      {isLoading ? (
        <Loading />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <VStack flex={1} p="$5">
            <FlatList
              data={fields}
              keyExtractor={(field: unknown) => (field as Field).id.toString()}
              renderItem={({ item: field, index }) => {
                const fieldTyped = field as Field
                return (
                  <HStack
                    bg={colors.card}
                    p="$2"
                    mb="$2"
                    rounded="$md"
                    alignItems="center"
                    justifyContent="space-between"
                    borderColor={
                      errors.items?.[index]?.unitPrice
                        ? '$error500'
                        : 'transparent'
                    }
                    borderWidth={errors.items?.[index]?.unitPrice ? 1 : 0}
                  >
                    <Text color={colors.textInactive}>{fieldTyped.name}</Text>
                    <Controller
                      control={control}
                      // Name uses the index provided by useFieldArray
                      name={`items.${index}.unitPrice`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          flex={1}
                          maxWidth="$48"
                          isInvalid={!!errors.items?.[index]?.unitPrice}
                        >
                          <InputField
                            placeholder="R$ 0,00"
                            color={colors.text}
                            placeholderTextColor={colors.textInactive}
                            selectionColor={colors.primary500}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              const numericValue = formatCurrencyMask(text)
                              onChange(
                                numericValue === '' ? null : numericValue,
                              )
                            }}
                            onBlur={onBlur}
                            value={
                              value === null || value === undefined
                                ? ''
                                : String(value)
                            }
                          />
                        </Input>
                      )}
                    />
                  </HStack>
                )
              }}
              ListEmptyComponent={() => (
                <Text color={colors.textInactive} textAlign="center" mt="$8">
                  Nenhum item na lista ainda.
                </Text>
              )}
              showsVerticalScrollIndicator={false}
            />

            {errors.items &&
              !errors.items.length &&
              typeof errors.items.message === 'string' && (
                <Text
                  color="$error500"
                  fontSize="$sm"
                  textAlign="center"
                  mt="$2"
                >
                  {errors.items.message}
                </Text>
              )}

            <Button
              title="Fechar Lista"
              mt="$5"
              onPress={handleSubmit(handleCloseShoppingList)}
            />
          </VStack>
        </KeyboardAvoidingView>
      )}
    </VStack>
  )
}
