import { ScreenHeader } from '@components/ScreenHeader'
import { VStack } from '@gluestack-ui/themed'

export function NewShoppingList() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Nova Lista de Compras" />
    </VStack>
  )
}
