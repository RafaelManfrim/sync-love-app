import { Center, Spinner } from '@gluestack-ui/themed'

export function Loading() {
  return (
    <Center flex={1} bg="$trueGray50">
      <Spinner color="$red500" />
    </Center>
  )
}
