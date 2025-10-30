import { Calendar, LocaleConfig } from 'react-native-calendars'
import { DateData } from 'react-native-calendars/src/types'
import { useTheme } from '@hooks/useTheme'
import { addYears } from 'date-fns'

// Configuração para o idioma Português (Brasil)
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan.',
    'Fev.',
    'Mar.',
    'Abr.',
    'Mai.',
    'Jun.',
    'Jul.',
    'Ago.',
    'Set.',
    'Out.',
    'Nov.',
    'Dez.',
  ],
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  today: 'Hoje',
}
LocaleConfig.defaultLocale = 'pt-br'

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

  const markedDates: MarkedDatesType = {}

  // Marca os dias com eventos
  dates.forEach((item) => {
    markedDates[item.date] = {
      marked: true,
      dotColor:
        item.type === 'anniversary' ? colors.primary700 : colors.primary500,
    }
  })

  // Marca o dia selecionado
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
      key={currentTheme} // Força re-renderização quando o tema muda
      onDayPress={onDayPress}
      markedDates={markedDates}
      onMonthChange={onMonthChange}
      maxDate={addYears(new Date(), 50).toDateString()} // hoje mais 50 anos com date fns
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
