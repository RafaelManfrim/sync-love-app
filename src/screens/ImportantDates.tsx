import { ScreenHeader } from '@components/ScreenHeader'
import { VStack } from '@gluestack-ui/themed'

export function ImportantDates() {
  return (
    <VStack flex={1}>
      <ScreenHeader title="Datas Importantes" hasGoBackButton />
    </VStack>
  )
}
