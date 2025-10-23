import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { Box } from '@gluestack-ui/themed'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Loading } from '@components/Loading'

import { useAuth } from '@hooks/useAuth'
import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'

import { useTheme } from '@hooks/useTheme'
import { useMemo } from 'react'

export function Routes() {
  const { user, isLoadingUserStorageData } = useAuth()
  const { colors } = useTheme()

  const theme = useMemo(() => {
    return {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
      },
    }
  }, [colors])

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg={colors.background}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          {user && user.id && user.couple_id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
      </SafeAreaProvider>
    </Box>
  )
}
