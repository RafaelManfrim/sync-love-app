import { Calendar, LocaleConfig } from 'react-native-calendars'
import { DateData } from 'react-native-calendars/src/types'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'

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
  selectedDate: string
}

export function CalendarView({ dates, onDayPress, selectedDate }: Props) {
  const colors = gluestackUIConfig.tokens.colors

  const markedDates: MarkedDatesType = {}

  // Marca os dias com eventos
  dates.forEach((item) => {
    markedDates[item.date] = {
      marked: true,
      dotColor: item.type === 'anniversary' ? colors.red500 : colors.blue500,
    }
  })

  // Marca o dia selecionado
  if (markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: colors.red700,
    }
  } else {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.red700,
    }
  }

  return (
    <Calendar
      onDayPress={onDayPress}
      markedDates={markedDates}
      theme={{
        backgroundColor: colors.trueGray200,
        calendarBackground: colors.trueGray200,
        textSectionTitleColor: colors.trueGray600,
        selectedDayBackgroundColor: colors.red500,
        selectedDayTextColor: '#ffffff',
        todayTextColor: colors.red500,
        dayTextColor: colors.trueGray500,
        textDisabledColor: colors.trueGray400,
        dotColor: colors.red500,
        selectedDotColor: '#ffffff',
        arrowColor: colors.red500,
        disabledArrowColor: colors.trueGray400,
        monthTextColor: colors.trueGray900,
        indicatorColor: 'blue',
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
