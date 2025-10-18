import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { Box } from '@gluestack-ui/themed'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Loading } from '@components/Loading'

import { useAuth } from '@hooks/useAuth'
import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'

import { gluestackUIConfig } from '../../config/gluestack-ui.config'

export function Routes() {
  const { user, isLoadingUserStorageData } = useAuth()

  const theme = DefaultTheme

  theme.colors.background = gluestackUIConfig.tokens.colors.trueGray50

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="$trueGray50">
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          {user && user.id && user.couple_id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
      </SafeAreaProvider>
    </Box>
  )
}
