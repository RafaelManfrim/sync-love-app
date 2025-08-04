import { Center, Heading, Icon } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

import { AppNavigationRoutesProps } from '@routes/app.routes'

type ScreenHeaderProps = {
  title: string
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const navigation = useNavigation<AppNavigationRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <Center bg="$red400" pt="$16" pb="$6">
      <TouchableOpacity onPress={handleGoBack}>
        <Icon as={ChevronLeft} color="$red600" size="xl" />
      </TouchableOpacity>
      <Heading fontSize="$xl" color="$gray100" fontFamily="$heading">
        {title}
      </Heading>
    </Center>
  )
}
