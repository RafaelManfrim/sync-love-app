import { ScreenHeader } from '@components/ScreenHeader'
import { VStack } from '@gluestack-ui/themed'

export function CloseShoppingList() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Fechar Lista de Compras" />
    </VStack>
  )
}
