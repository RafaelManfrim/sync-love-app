import { ScreenHeader } from '@components/ScreenHeader'
import { VStack } from '@gluestack-ui/themed'

export function ShoppingLists() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Listas de Compras" hasGoBackButton />
    </VStack>
  )
}
