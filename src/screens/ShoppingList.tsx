import { Button } from '@components/Button'
import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ShoppingListItem } from '@components/ShoppingListItem'
import { ToastMessage } from '@components/ToastMessage'
import { ProductDTO } from '@dtos/ProductDTO'
import { ShoppingItemDTO } from '@dtos/ShoppingItemDTO'
import {
  KeyboardAvoidingView,
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
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { translateApiError } from '@utils/translateApiError'

export function ShoppingList() {
  const [newItemName, setNewItemName] = useState('')
  const [suggestions, setSuggestions] = useState<ProductDTO[]>([])

  const { colors } = useTheme()
  const { t } = useTranslation()

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
    refetch,
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
            title={t('shoppingList.itemAdded')}
            action="success"
          />
        ),
        placement: 'top',
      })

      invalidateListDetails(shoppingListId)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? translateApiError(error)
        : t('shoppingList.addItemError')
      toast.show({
        placement: 'top',
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
        ? translateApiError(error)
        : t('shoppingList.updateItemError')
      toast.show({
        placement: 'top',
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

  const isListClosed = !!shoppingList?.closed_at

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('shoppingList.title')} hasGoBackButton />

      {isLoading ? (
        <Loading />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <VStack flex={1} p="$5">
            <Text
              color={colors.title}
              textAlign="center"
              fontFamily="$heading"
              bold
              fontSize="$lg"
              mb={isListClosed ? '$2' : '$4'}
            >
              {shoppingList?.name}
            </Text>
            {isListClosed && (
              <Text
                color={colors.primary500}
                textAlign="center"
                fontFamily="$heading"
                bold
                fontSize="$lg"
                mb="$4"
              >
                {t('shoppingList.completedLabel')}
              </Text>
            )}

            {/* Formulário de Adicionar Item com Autocomplete - Oculto se a lista estiver fechada */}
            {!isListClosed && (
              <VStack mb="$5">
                <HStack space="sm">
                  <Input flex={1}>
                    <InputField
                      placeholder={t('shoppingList.itemPlaceholder')}
                      value={newItemName}
                      onChangeText={handleSearchTermChange}
                      onSubmitEditing={handleAddItem}
                      color={colors.text}
                      placeholderTextColor={colors.textInactive}
                      selectionColor={colors.primary500}
                    />
                  </Input>
                  <Button
                    title={t('shoppingList.addButton')}
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
            )}

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
                    isReadOnly={isListClosed}
                  />
                )
              }}
              ListHeaderComponent={() => (
                <HStack
                  px="$2"
                  borderBottomWidth={1}
                  borderBottomColor={colors.border}
                  pb="$2"
                >
                  <Text flex={1} color={colors.textInactive} fontSize="$sm">
                    {t('shoppingList.itemHeader')}
                  </Text>
                  <Text color={colors.textInactive} fontSize="$sm">
                    {isListClosed
                      ? t('shoppingList.paidPriceHeader')
                      : t('shoppingList.averagePriceHeader')}
                  </Text>
                </HStack>
              )}
              ListEmptyComponent={() => (
                <Text color={colors.textInactive} textAlign="center" mt="$8">
                  {t('shoppingList.emptyList')}
                </Text>
              )}
              showsVerticalScrollIndicator={false}
            />
            {!isListClosed && (
              <Button
                title={t('shoppingList.finishButton')}
                mt="$5"
                onPress={handleCloseShoppingList}
                disabled={
                  !shoppingList ||
                  shoppingList.ShoppingListItem.filter(
                    (item) => item.is_checked,
                  ).length === 0
                }
              />
            )}
          </VStack>
        </KeyboardAvoidingView>
      )}
    </VStack>
  )
}
