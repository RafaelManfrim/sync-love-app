import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { ShoppingItemDTO } from '@dtos/ShoppingItemDTO'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import { Text, FlatList, HStack, VStack, useToast } from '@gluestack-ui/themed'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {
  ShoppingListNavigationRoutesProps,
  ShoppingListScreenProps,
} from '@routes/lists.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useCallback, useState } from 'react'

export function CloseShoppingList() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listDetails, setListDetails] = useState<ShoppingListDTO | null>(null)

  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()
  const route = useRoute()
  const toast = useToast()
  const { shoppingListId } = route.params as ShoppingListScreenProps

  async function getShoppingListDetails(listId: number) {
    const { data } = await api.get<{ shoppingList: ShoppingListDTO }>(
      `/shopping-lists/${listId}`,
    )

    return data.shoppingList
  }

  async function fetchListDetails() {
    try {
      setIsLoading(true)
      const [details] = await Promise.all([
        getShoppingListDetails(shoppingListId),
      ])
      setListDetails(details)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes da lista.'
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            title={title}
            action="error"
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleCloseShoppingList() {
    navigation.navigate('closeShoppingList', { shoppingListId })
  }

  useFocusEffect(
    useCallback(() => {
      fetchListDetails()
    }, [shoppingListId]),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Fechar Lista de Compras" hasGoBackButton />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} p="$5">
          {/* Lista de Itens */}
          <FlatList
            data={listDetails?.ShoppingListItem.filter(
              (item) => item.is_checked,
            )}
            keyExtractor={(item: unknown) =>
              (item as ShoppingItemDTO).id.toString()
            }
            renderItem={({ item }) => {
              const itemTyped = item as ShoppingItemDTO
              return (
                <HStack
                  bg="$gray600"
                  p="$3"
                  rounded="$md"
                  mb="$3"
                  alignItems="center"
                  opacity={itemTyped.is_checked ? 0.5 : 1}
                >
                  <Text
                    color="$trueGray400"
                    flex={1}
                    textDecorationLine={
                      itemTyped.is_checked ? 'line-through' : 'none'
                    }
                  >
                    {itemTyped.product.name}
                  </Text>
                </HStack>
              )
            }}
            ListEmptyComponent={() => (
              <Text color="$trueGray300" textAlign="center" mt="$8">
                Nenhum item na lista ainda.
              </Text>
            )}
            showsVerticalScrollIndicator={false}
          />
          <Button
            title="Fechar Lista"
            mt="$5"
            onPress={handleCloseShoppingList}
          />
        </VStack>
      )}
    </VStack>
  )
}
