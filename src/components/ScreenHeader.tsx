import { Heading, HStack, Icon } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

import { AppNavigationRoutesProps } from '@routes/app.routes'
import { useTheme } from '@hooks/useTheme'

type ScreenHeaderProps = {
  title: string
  hasGoBackButton?: boolean
}

export function ScreenHeader({
  title,
  hasGoBackButton = false,
}: ScreenHeaderProps) {
  const navigation = useNavigation<AppNavigationRoutesProps>()

  const { colors } = useTheme()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <HStack
      bg={colors.primary400}
      pt="$10"
      alignItems="center"
      justifyContent="center"
    >
      {hasGoBackButton && (
        <TouchableOpacity
          onPress={handleGoBack}
          style={{ position: 'absolute', left: 24, top: 44 }}
        >
          <Icon as={ChevronLeft} color={colors.primary600} size="xl" />
        </TouchableOpacity>
      )}
      <Heading
        fontSize="$xl"
        color={colors.textContrast}
        fontFamily="$heading"
        pb="$5"
      >
        {title}
      </Heading>
    </HStack>
  )
}
