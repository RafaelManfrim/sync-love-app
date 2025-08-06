import { ScreenHeader } from '@components/ScreenHeader'
import { VStack, Text, HStack, Icon } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { HomeNavigationRoutesProps } from '@routes/home.routes'
import { ChevronRight } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

export function Home() {
  const navigation = useNavigation<HomeNavigationRoutesProps>()

  function handleNavigateToShoppingLists() {
    navigation.navigate('shoppingLists')
  }

  function handleNavigateToB() {}

  return (
    <VStack flex={1}>
      <ScreenHeader title="Tela Inicial" />

      <VStack flex={1} p="$6" gap="$3">
        <TouchableOpacity onPress={handleNavigateToShoppingLists}>
          <HStack
            w="$full"
            bgColor="$trueGray200"
            alignItems="center"
            p="$3"
            borderRadius="$md"
          >
            <VStack pl="$3" mr="auto">
              <Text>Listas de Compras</Text>
              <Text fontSize="$sm" color="$trueGray500">
                4 itens
              </Text>
            </VStack>
            <Icon as={ChevronRight} color="$red600" size="xl" />
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToB}>
          <HStack
            w="$full"
            bgColor="$trueGray200"
            alignItems="center"
            p="$3"
            borderRadius="$md"
          >
            <VStack pl="$3" mr="auto">
              <Text>Listas de Afazeres</Text>
              <Text fontSize="$sm" color="$trueGray500">
                3 itens
              </Text>
            </VStack>
            <Icon as={ChevronRight} color="$red600" size="xl" />
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  )
}
