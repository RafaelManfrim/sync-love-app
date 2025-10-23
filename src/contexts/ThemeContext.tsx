import { createContext, ReactNode, useState, useEffect, useMemo } from 'react'
import { theme as customTheme, ThemeColors, ThemeName } from '../theme'
import { storageThemeGet, storageThemeSave } from '@storage/storageTheme'
import { GluestackUIProvider } from '@gluestack-ui/themed'

export type ThemeContextData = {
  currentTheme: ThemeName
  changeTheme: (themeName: ThemeName) => void
  colors: ThemeColors
  customTheme: typeof customTheme
}

export const ThemeContext = createContext<ThemeContextData>(
  {} as ThemeContextData,
)

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('default')
  const [isLoading, setIsLoading] = useState(true)

  const colors = useMemo(() => customTheme.config.tokens.colors[theme], [theme])

  const changeTheme = async (themeName: ThemeName) => {
    if (themeName === theme) {
      return
    }

    setTheme(themeName)
    await storageThemeSave(themeName)
  }

  useEffect(() => {
    async function loadThemeFromStorage() {
      const storedTheme = await storageThemeGet()
      if (storedTheme) {
        setTheme(storedTheme)
      }
      setIsLoading(false)
    }
    loadThemeFromStorage()
  }, [])

  // Evita renderizar a app com o tema errado enquanto carrega do storage
  if (isLoading) {
    return null
  }

  return (
    <ThemeContext.Provider
      value={{ colors, customTheme, currentTheme: theme, changeTheme }}
    >
      <GluestackUIProvider config={customTheme.config}>
        {children}
      </GluestackUIProvider>
    </ThemeContext.Provider>
  )
}
