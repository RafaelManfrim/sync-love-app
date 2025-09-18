import { Heading, HStack, Icon } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

import { AppNavigationRoutesProps } from '@routes/app.routes'

type ScreenHeaderProps = {
  title: string
  hasGoBackButton?: boolean
}

export function ScreenHeader({
  title,
  hasGoBackButton = false,
}: ScreenHeaderProps) {
  const navigation = useNavigation<AppNavigationRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <HStack bg="$red400" pt="$12" alignItems="center" justifyContent="center">
      {hasGoBackButton && (
        <TouchableOpacity
          onPress={handleGoBack}
          style={{ position: 'absolute', left: 24, top: 52 }}
        >
          <Icon as={ChevronLeft} color="$red600" size="xl" />
        </TouchableOpacity>
      )}
      <Heading
        fontSize="$xl"
        color="$trueGray100"
        fontFamily="$heading"
        pb="$6"
      >
        {title}
      </Heading>
    </HStack>
  )
}
