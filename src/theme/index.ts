import { createConfig } from '@gluestack-ui/themed'

import { config as baseConfig } from '../../config/gluestack-ui.config'

export type ThemeColors = {
  card: string
  background: string
  title: string
  text: string
  textContrast: string
  textInactive: string
  border: string
  primary400: string
  primary500: string
  primary600: string
  primary700: string
}

const defaultColors: ThemeColors = {
  card: '#ffffff',
  background: '#f0f1f2',
  title: '#03040a',
  text: '#242427',
  textContrast: '#ffffff',
  textInactive: '#6b7280',
  border: '#e5e7eb',
  primary400: '#f87171',
  primary500: '#ef4444',
  primary600: '#dc2626',
  primary700: '#b91c1c',
}

const defaultDarkColors: ThemeColors = {
  card: '#1f2937',
  background: '#111827',
  title: '#FFF',
  text: '#f9fafb',
  textContrast: '#111827',
  textInactive: '#9ca3af',
  border: '#374151',
  primary400: '#f87171',
  primary500: '#ef4444',
  primary600: '#dc2626',
  primary700: '#c92c2c',
}

const pinkColors: ThemeColors = {
  card: '#ffffff',
  background: '#fdf2f8',
  title: '#3b0d2a',
  text: '#4a044e',
  textContrast: '#ffffff',
  textInactive: '#9d8189',
  border: '#fbcfe8',
  primary400: '#fb7185',
  primary500: '#f43f5e',
  primary600: '#e11d48',
  primary700: '#be123c',
}

const pinkDarkColors: ThemeColors = {
  card: '#3b0d2a',
  background: '#1e0b15',
  title: '#fff0f6',
  text: '#fce7f3',
  textContrast: '#1e0b15',
  textInactive: '#f5c2e7',
  border: '#4a044e',
  primary400: '#fb7185',
  primary500: '#f43f5e',
  primary600: '#e11d48',
  primary700: '#be123c',
}

const purpleColors: ThemeColors = {
  card: '#ffffff',
  background: '#f5f3ff',
  title: '#2e1065',
  text: '#4c1d95',
  textContrast: '#ffffff',
  textInactive: '#8b5cf6',
  border: '#ddd6fe',
  primary400: '#a78bfa',
  primary500: '#8b5cf6',
  primary600: '#7c3aed',
  primary700: '#6d28d9',
}

const purpleDarkColors: ThemeColors = {
  card: '#2e1065',
  background: '#1e1b4b',
  title: '#ede9fe',
  text: '#f5f3ff',
  textContrast: '#1e1b4b',
  textInactive: '#c4b5fd',
  border: '#4c1d95',
  primary400: '#a78bfa',
  primary500: '#8b5cf6',
  primary600: '#7c3aed',
  primary700: '#6d28d9',
}

const blueColors: ThemeColors = {
  card: '#ffffff',
  background: '#eff6ff',
  title: '#082f49',
  text: '#1e3a8a',
  textContrast: '#ffffff',
  textInactive: '#64748b',
  border: '#bfdbfe',
  primary400: '#60a5fa',
  primary500: '#3b82f6',
  primary600: '#2563eb',
  primary700: '#1d4ed8',
}

const blueDarkColors: ThemeColors = {
  card: '#1e3a8a',
  background: '#0f172a',
  title: '#dbeafe',
  text: '#e0f2fe',
  textContrast: '#0f172a',
  textInactive: '#93c5fd',
  border: '#1e40af',
  primary400: '#60a5fa',
  primary500: '#3b82f6',
  primary600: '#2563eb',
  primary700: '#1d4ed8',
}

const greenColors: ThemeColors = {
  card: '#ffffff',
  background: '#f0fdf4',
  title: '#064e3b',
  text: '#166534',
  textContrast: '#ffffff',
  textInactive: '#6b7280',
  border: '#bbf7d0',
  primary400: '#4ade80',
  primary500: '#22c55e',
  primary600: '#16a34a',
  primary700: '#15803d',
}

const greenDarkColors: ThemeColors = {
  card: '#064e3b',
  background: '#022c22',
  title: '#dcfce7',
  text: '#ecfdf5',
  textContrast: '#022c22',
  textInactive: '#86efac',
  border: '#14532d',
  primary400: '#4ade80',
  primary500: '#22c55e',
  primary600: '#16a34a',
  primary700: '#15803d',
}

const colorThemes = {
  default: defaultColors,
  defaultDark: defaultDarkColors,
  romanticPink: pinkColors,
  romanticPinkDark: pinkDarkColors,
  royalPurple: purpleColors,
  royalPurpleDark: purpleDarkColors,
  oceanBlue: blueColors,
  oceanBlueDark: blueDarkColors,
  freshGreen: greenColors,
  freshGreenDark: greenDarkColors,
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
