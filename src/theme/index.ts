import { createConfig } from '@gluestack-ui/themed'

import { config as baseConfig } from '../../config/gluestack-ui.config'

export type ThemeColors = {
  card: string
  background: string
  text: string
  textContrast: string
  textInactive: string
  border: string
  primary400: string
  primary500: string
  primary600: string
}

const defaultColors: ThemeColors = {
  card: '#ffffff',
  background: '#f9fafb',
  text: '#111827',
  textContrast: '#ffffff',
  textInactive: '#6b7280',
  border: '#e5e7eb',
  primary400: '#f87171',
  primary500: '#ef4444',
  primary600: '#dc2626',
}

const defaultDarkColors: ThemeColors = {
  card: '#1f2937',
  background: '#111827',
  text: '#f9fafb',
  textContrast: '#111827',
  textInactive: '#9ca3af',
  border: '#374151',
  primary400: '#f87171',
  primary500: '#ef4444',
  primary600: '#dc2626',
}

const oceanBlueColors: ThemeColors = {
  card: '#e0f2fe',
  background: '#0284c7',
  text: '#0369a1',
  textContrast: '#ffffff',
  textInactive: '#7dd3fc',
  border: '#7dd3fc',
  primary400: '#38bdf8',
  primary500: '#0ea5e9',
  primary600: '#0284c7',
}

const colorThemes = {
  default: defaultColors,
  defaultDark: defaultDarkColors,
  oceanBlue: oceanBlueColors,
} as const

export type ThemeName = keyof typeof colorThemes

const createThemeConfig = (colors: typeof colorThemes) => {
  return createConfig({
    ...baseConfig,
    tokens: {
      ...baseConfig.tokens,
      colors: {
        ...baseConfig.tokens.colors,
        ...colors,
      },
    },
  })
}

export const theme = {
  config: createThemeConfig(colorThemes),
  primaryColor: defaultColors.primary500,
}
