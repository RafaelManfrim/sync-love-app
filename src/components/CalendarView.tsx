import { Calendar, LocaleConfig } from 'react-native-calendars'
import { DateData } from 'react-native-calendars/src/types'
import { useTheme } from '@hooks/useTheme'
import { addYears } from 'date-fns'
import { useLanguage } from '@hooks/useLanguage'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

type MarkedDatesType = {
  [key: string]: {
    marked?: boolean
    dotColor?: string
    selected?: boolean
    selectedColor?: string
  }
}

type Props = {
  dates: Array<{ date: string; type: 'anniversary' | 'birthday' | 'event' }>
  onDayPress: (date: DateData) => void
  onMonthChange?: (date: DateData) => void
  selectedDate: string
}

export function CalendarView({
  dates,
  onDayPress,
  selectedDate,
  onMonthChange,
}: Props) {
  const { colors, currentTheme } = useTheme()
  const { currentLanguage, localeKey } = useLanguage()
  const { t } = useTranslation()

  // Configurar o locale do calendário baseado no idioma atual
  useEffect(() => {
    LocaleConfig.locales[localeKey] = {
      monthNames: t('components.calendarView.monthNames', {
        returnObjects: true,
      }) as string[],
      monthNamesShort: t('components.calendarView.monthNamesShort', {
        returnObjects: true,
      }) as string[],
      dayNames: t('components.calendarView.dayNames', {
        returnObjects: true,
      }) as string[],
      dayNamesShort: t('components.calendarView.dayNamesShort', {
        returnObjects: true,
      }) as string[],
      today: t('components.calendarView.today'),
    }
    LocaleConfig.defaultLocale = localeKey
  }, [t, localeKey])

  const markedDates: MarkedDatesType = {}

  dates.forEach((item) => {
    markedDates[item.date] = {
      marked: true,
      dotColor:
        item.type === 'anniversary' ? colors.primary700 : colors.primary500,
    }
  })

  if (markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: colors.primary600,
    }
  } else {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.primary600,
    }
  }

  return (
    <Calendar
      key={`${currentTheme}-${currentLanguage}`}
      onDayPress={onDayPress}
      markedDates={markedDates}
      onMonthChange={onMonthChange}
      maxDate={addYears(new Date(), 50).toDateString()}
      theme={{
        backgroundColor: colors.card,
        calendarBackground: colors.card,
        textSectionTitleColor: colors.text,
        selectedDayBackgroundColor: colors.primary500,
        selectedDayTextColor: colors.textContrast,
        todayTextColor: colors.primary500,
        dayTextColor: colors.text,
        textDisabledColor: colors.textInactive,
        dotColor: colors.primary500,
        selectedDotColor: colors.textContrast,
        arrowColor: colors.primary500,
        disabledArrowColor: colors.textInactive,
        monthTextColor: colors.title,
        indicatorColor: colors.primary500,
        textDayFontFamily: 'Roboto_400Regular',
        textMonthFontFamily: 'Roboto_700Bold',
        textDayHeaderFontFamily: 'Roboto_700Bold',
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14,
      }}
    />
  )
}
