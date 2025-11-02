import i18n from '../locales/i18n'

// Tipos de Recorrência
export type RecurrenceType =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'bimonthly'
  | 'custom'

// Opções de Recorrência (função para usar traduções)
export const getRecurrenceOptions = () => [
  { label: i18n.t('utils.recurrenceTypes.none'), value: 'none' },
  { label: i18n.t('utils.recurrenceTypes.daily'), value: 'daily' },
  { label: i18n.t('utils.recurrenceTypes.weekly'), value: 'weekly' },
  { label: i18n.t('utils.recurrenceTypes.biweekly'), value: 'biweekly' },
  { label: i18n.t('utils.recurrenceTypes.monthly'), value: 'monthly' },
  { label: i18n.t('utils.recurrenceTypes.bimonthly'), value: 'bimonthly' },
  { label: i18n.t('utils.recurrenceTypes.custom'), value: 'custom' },
]

// Mapeia o tipo de recorrência para a regra RRULE
export const getRecurrenceRule = (
  type: RecurrenceType,
  selectedWeekDays?: string[],
): string | null => {
  switch (type) {
    case 'none':
      return null
    case 'daily':
      return 'FREQ=DAILY'
    case 'weekly':
      return 'FREQ=WEEKLY'
    case 'biweekly':
      return 'FREQ=WEEKLY;INTERVAL=2'
    case 'monthly':
      return 'FREQ=MONTHLY'
    case 'bimonthly':
      return 'FREQ=MONTHLY;INTERVAL=2'
    case 'custom':
      if (selectedWeekDays && selectedWeekDays.length > 0) {
        const byday = selectedWeekDays.join(',')
        return `FREQ=WEEKLY;BYDAY=${byday}`
      }
      return null
    default:
      return null
  }
}

// Mapeia RRULE para tipo de recorrência
export const getRecurrenceTypeFromRule = (
  rule: string | null,
): RecurrenceType => {
  if (!rule) return 'none'

  if (rule === 'FREQ=DAILY') return 'daily'
  if (rule === 'FREQ=WEEKLY') return 'weekly'
  if (rule === 'FREQ=WEEKLY;INTERVAL=2') return 'biweekly'
  if (rule === 'FREQ=MONTHLY') return 'monthly'
  if (rule === 'FREQ=MONTHLY;INTERVAL=2') return 'bimonthly'
  if (rule.includes('FREQ=WEEKLY;BYDAY=')) return 'custom'

  return 'none'
}

// Extrai os dias da semana de uma RRULE custom
export const getWeekDaysFromRule = (rule: string | null): string[] => {
  if (!rule || !rule.includes('BYDAY=')) return []

  const match = rule.match(/BYDAY=([A-Z,]+)/)
  if (match && match[1]) {
    return match[1].split(',')
  }

  return []
}
