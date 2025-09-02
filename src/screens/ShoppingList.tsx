import { ScreenHeader } from '@components/ScreenHeader'
import { VStack } from '@gluestack-ui/themed'

export function ShoppingList() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Lista de Compras" hasGoBackButton />
    </VStack>
  )
}
