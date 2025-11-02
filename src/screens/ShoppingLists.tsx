import { Loading } from '@components/Loading'
import { ScreenHeader } from '@components/ScreenHeader'
import { ShoppingListDTO } from '@dtos/ShoppingListDTO'
import {
  FlatList,
  Heading,
  HStack,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ShoppingListNavigationRoutesProps } from '@routes/lists.routes'

import { useCallback, useMemo, useState } from 'react'

import { AddRoundedButton } from '@components/AddRoundedButton'
import { useShoppingListQueries } from '@hooks/api/useShoppingListQueries'
import { useTheme } from '@hooks/useTheme'
import { ShoppingListCard } from '@components/ShoppingListCard'
import { useTranslation } from 'react-i18next'

export function ShoppingLists() {
  const { useFetchShoppingLists } = useShoppingListQueries()

  const { data: shoppingLists, isLoading, refetch } = useFetchShoppingLists()

  const { colors } = useTheme()
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')

  const navigation = useNavigation<ShoppingListNavigationRoutesProps>()

  const openLists = useMemo(() => {
    return shoppingLists?.filter((list) => !list.closed_at) || []
  }, [shoppingLists])

  const closedLists = useMemo(() => {
    return shoppingLists?.filter((list) => list.closed_at) || []
  }, [shoppingLists])

  const currentLists = activeTab === 'open' ? openLists : closedLists

  function handleOpenShoppingList(shoppingListId: number) {
    navigation.navigate('shoppingList', { shoppingListId })
  }

  function handleNewShoppingList() {
    navigation.navigate('newShoppingList')
  }

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title={t('shoppingLists.title')} />
      {!isLoading && shoppingLists ? (
        <>
          <VStack flex={1} p="$6" gap="$3">
            {/* Tabs */}
            <HStack gap="$2">
              <Pressable
                flex={1}
                py="$3"
                borderBottomWidth={2}
                borderBottomColor={
                  activeTab === 'open' ? colors.primary500 : 'transparent'
                }
                onPress={() => setActiveTab('open')}
              >
                <Text
                  color={
                    activeTab === 'open'
                      ? colors.primary500
                      : colors.textInactive
                  }
                  fontSize="$sm"
                  fontFamily="$heading"
                  textAlign="center"
                >
                  {t('shoppingLists.openTab', { count: openLists.length })}
                </Text>
              </Pressable>

              <Pressable
                flex={1}
                py="$3"
                borderBottomWidth={2}
                borderBottomColor={
                  activeTab === 'closed' ? colors.primary500 : 'transparent'
                }
                onPress={() => setActiveTab('closed')}
              >
                <Text
                  color={
                    activeTab === 'closed'
                      ? colors.primary500
                      : colors.textInactive
                  }
                  fontSize="$sm"
                  fontFamily="$heading"
                  textAlign="center"
                >
                  {t('shoppingLists.closedTab', { count: closedLists.length })}
                </Text>
              </Pressable>
            </HStack>

            <HStack justifyContent="space-between" alignItems="center">
              <Heading
                color={colors.textInactive}
                fontSize="$md"
                fontFamily="$heading"
              >
                {t('shoppingLists.listsHeader')}
              </Heading>

              <Text color={colors.title} fontSize="$sm" fontFamily="$body">
                {currentLists.length}
              </Text>
            </HStack>
            <FlatList
              data={currentLists}
              keyExtractor={(item) => {
                const shoppingList = item as ShoppingListDTO
                return shoppingList.id.toString()
              }}
              renderItem={({ item }) => {
                const shoppingList = item as ShoppingListDTO
                return (
                  <ShoppingListCard
                    shoppingList={shoppingList}
                    handleOpenShoppingList={handleOpenShoppingList}
                  />
                )
              }}
              ListEmptyComponent={() => (
                <Text color={colors.textInactive} textAlign="center" mt="$8">
                  {activeTab === 'open'
                    ? t('shoppingLists.emptyOpen')
                    : t('shoppingLists.emptyClosed')}
                </Text>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </VStack>

          <AddRoundedButton onPress={handleNewShoppingList} />
        </>
      ) : (
        <Loading />
      )}
    </VStack>
  )
}
