import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ToastMessage } from '@components/ToastMessage'
import { ProductDTO } from '@dtos/ProductDTO'
import { ShoppingItemDTO } from '@dtos/ShoppingItemDTO'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckIcon,
  FlatList,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
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

export function ShoppingList() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listDetails, setListDetails] = useState<ShoppingListDTO | null>(null)

  // Estados para o formulário de adicionar item
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [suggestions, setSuggestions] = useState<ProductDTO[]>([])

  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()
  const route = useRoute()
  const toast = useToast()
  const { shoppingListId } = route.params as ShoppingListScreenProps

  async function getProducts() {
    const { data } = await api.get<{ products: ProductDTO[] }>(
      '/shopping-lists/products',
    )
    return data.products
  }

  async function getShoppingListDetails(listId: number) {
    const { data } = await api.get<{ shoppingList: ShoppingListDTO }>(
      `/shopping-lists/${listId}`,
    )

    return data.shoppingList
  }

  async function addItemToList(
    listId: number,
    itemName: string,
    quantity: number,
  ) {
    await api.post(`/shopping-lists/${listId}/items`, { itemName, quantity })
  }

  async function toggleItemCheck(listId: number, itemId: number) {
    await api.patch(`/shopping-lists/${listId}/items/${itemId}/toggle`)
  }

  async function fetchListDetails() {
    try {
      setIsLoading(true)
      const [details, allProducts] = await Promise.all([
        getShoppingListDetails(shoppingListId),
        getProducts(),
      ])
      setListDetails(details)
      setProducts(allProducts)
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

  async function handleAddItem() {
    if (!newItemName.trim()) return

    try {
      setIsSubmitting(true)
      await addItemToList(shoppingListId, newItemName, 1) // Quantidade fixa em 1 por enquanto
      setNewItemName('')
      setSuggestions([])
      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            title="Item adicionado!"
            action="success"
          />
        ),
      })
      await fetchListDetails() // Refresca a lista
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível adicionar o item.'
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
      setIsSubmitting(false)
    }
  }

  async function handleToggleItem(itemId: number) {
    try {
      // Optimistic Update: Atualiza a UI antes da resposta da API
      const updatedItems = listDetails!.ShoppingListItem.map((item) =>
        item.id === itemId
          ? {
              ...item,
              is_checked: !item.is_checked,
            }
          : item,
      )
      setListDetails({ ...listDetails!, ShoppingListItem: updatedItems })

      await toggleItemCheck(shoppingListId, itemId)
    } catch (error) {
      // Reverte em caso de erro
      fetchListDetails()
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o item.'
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
    }
  }

  function handleSearchTermChange(text: string) {
    setNewItemName(text)
    if (text.length > 1) {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase()),
      )
      setSuggestions(filteredProducts.slice(0, 5)) // Limita a 5 sugestões
    } else {
      setSuggestions([])
    }
  }

  function handleSelectSuggestion(product: ProductDTO) {
    setNewItemName(product.name)
    setSuggestions([])
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
      <ScreenHeader title="Lista de Compras" hasGoBackButton />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} p="$5">
          {/* Formulário de Adicionar Item com Autocomplete */}
          <VStack mb="$5">
            <HStack space="sm">
              <Input flex={1}>
                <InputField
                  placeholder="Digite o nome do item"
                  value={newItemName}
                  onChangeText={handleSearchTermChange}
                  onSubmitEditing={handleAddItem}
                />
              </Input>
              <Button
                title="Add"
                onPress={handleAddItem}
                isLoading={isSubmitting}
                w="$20"
              />
            </HStack>
            {suggestions.length > 0 && (
              <VStack mt="$2" bg="$trueGray200" rounded="$md">
                {suggestions.map((item) => (
                  <Pressable
                    key={item.id}
                    p="$3"
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Text color="$black">{item.name}</Text>
                  </Pressable>
                ))}
              </VStack>
            )}
          </VStack>

          {/* Lista de Itens */}
          <FlatList
            data={listDetails?.ShoppingListItem}
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
                  <Checkbox
                    size="md"
                    isChecked={itemTyped.is_checked}
                    onChange={() => handleToggleItem(itemTyped.id)}
                    aria-label={itemTyped.product.name}
                    value={itemTyped.product.name}
                  >
                    <CheckboxIndicator mr="$3">
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                  </Checkbox>
                  <Text
                    color="$trueGray400"
                    flex={1}
                    textDecorationLine={
                      itemTyped.is_checked ? 'line-through' : 'none'
                    }
                  >
                    {itemTyped.product.name}
                  </Text>
                  <Text color="$trueGray300" fontSize="$xs">
                    (x{itemTyped.quantity})
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
            title="Finalizar Compra"
            mt="$5"
            onPress={handleCloseShoppingList}
          />
        </VStack>
      )}
    </VStack>
  )
}
