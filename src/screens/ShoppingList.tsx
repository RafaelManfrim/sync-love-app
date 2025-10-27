import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ShoppingListItem } from '@components/ShoppingListItem'
import { ToastMessage } from '@components/ToastMessage'
import { ProductDTO } from '@dtos/ProductDTO'
import { ShoppingItemDTO } from '@dtos/ShoppingItemDTO'
import {
  FlatList,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
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
import { AppError } from '@utils/AppError'
import { useCallback, useState } from 'react'

export function ShoppingList() {
  // const [isLoading, setIsLoading] = useState(true)
  // const [isSubmitting, setIsSubmitting] = useState(false)
  // const [listDetails, setListDetails] = useState<ShoppingListDTO | null>(null)

  // Estados para o formulário de adicionar item
  // const [products, setProducts] = useState<ProductDTO[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [suggestions, setSuggestions] = useState<ProductDTO[]>([])

  const { colors } = useTheme()

  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()
  const route = useRoute()
  const toast = useToast()
  const { shoppingListId } = route.params as ShoppingListScreenProps

  const {
    useFetchShoppingListDetails,
    useToggleItemCheck,
    useFetchProducts,
    useAddItemToList,
    invalidateListDetails,
  } = useShoppingListQueries()

  const { data: products } = useFetchProducts()

  const {
    data: shoppingList,
    isLoading,
    // isRefetching,
    refetch,
    // error,
  } = useFetchShoppingListDetails(shoppingListId)

  const { mutate: toggleItem } = useToggleItemCheck()

  const { mutateAsync: addItemToList, isPending: isAddingItem } =
    useAddItemToList()

  async function handleAddItem() {
    if (!newItemName.trim()) return

    try {
      await addItemToList({
        listId: shoppingListId,
        itemName: newItemName,
        quantity: 1,
      })
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
        placement: 'top',
      })

      invalidateListDetails(shoppingListId)
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
    }
  }

  async function handleToggleItem(itemId: number) {
    try {
      toggleItem({ listId: shoppingListId, itemId })
    } catch (error) {
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
    if (!products) return

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
      refetch()
    }, [refetch]),
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
                  color={colors.text}
                  placeholderTextColor={colors.textInactive}
                  selectionColor={colors.primary500}
                />
              </Input>
              <Button
                title="+"
                onPress={handleAddItem}
                isLoading={isAddingItem}
                w="$12"
                h="$10"
              />
            </HStack>
            {suggestions.length > 0 && (
              <VStack
                mt="$2"
                bg={colors.card}
                rounded="$md"
                p="$3"
                gap="$2"
                borderWidth={1}
                borderColor={colors.border}
              >
                {suggestions.map((item) => (
                  <Pressable
                    key={item.id}
                    p="$3"
                    bg={colors.background}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Text color={colors.text}>{item.name}</Text>
                  </Pressable>
                ))}
              </VStack>
            )}
          </VStack>

          {/* Lista de Itens */}
          <FlatList
            data={shoppingList?.ShoppingListItem}
            keyExtractor={(item: unknown) =>
              (item as ShoppingItemDTO).id.toString()
            }
            renderItem={({ item }) => {
              const itemTyped = item as ShoppingItemDTO
              return (
                <ShoppingListItem
                  item={itemTyped}
                  handleToggleItem={handleToggleItem}
                />
              )
            }}
            ListEmptyComponent={() => (
              <Text color={colors.textInactive} textAlign="center" mt="$8">
                Nenhum item na lista ainda.
              </Text>
            )}
            showsVerticalScrollIndicator={false}
          />
          <Button
            title="Finalizar Compra"
            mt="$5"
            onPress={handleCloseShoppingList}
            disabled={
              !shoppingList ||
              shoppingList.ShoppingListItem.filter((item) => item.is_checked)
                .length === 0
            }
          />
        </VStack>
      )}
    </VStack>
  )
}
