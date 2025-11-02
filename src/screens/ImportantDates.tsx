import { CalendarView } from '@components/CalendarView'
import { EventManagementCard } from '@components/EventManagementCard'
import { ScreenHeader } from '@components/ScreenHeader'
import {
  Box,
  Center,
  FlatList,
  Text,
  VStack,
  Spinner,
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useTheme } from '@hooks/useTheme'
import { useCalendarQueries } from '@hooks/api/useCalendarQueries'
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { DatesNavigationRoutesProps } from '@routes/dates.routes'
import { CalendarEventOccurrenceDTO } from '@dtos/CalendarEventDTO'
import { AddRoundedButton } from '@components/AddRoundedButton'
import { useTranslation } from 'react-i18next'

export function ImportantDates() {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const navigation = useNavigation<DatesNavigationRoutesProps>()
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Busca eventos do mês selecionado
  const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd')

  const { useFetchCalendarEvents } = useCalendarQueries()
  const {
    data: events = [],
    isLoading,
    isError,
  } = useFetchCalendarEvents(startDate, endDate)

  const handleAddNewDate = () => {
    navigation.navigate('eventCreate')
  }

  const handleEditEvent = (eventId: number) => {
    navigation.navigate('eventEdit', { eventId })
  }

  const renderEmptyState = () => (
    <Center flex={1} px="$6">
      <Text color={colors.text} fontSize="$md" textAlign="center">
        {t('importantDates.emptyMonth')}
      </Text>
      <Text
        color={colors.text}
        fontSize="$sm"
        textAlign="center"
        mt="$2"
        opacity={0.7}
      >
        {t('importantDates.emptyDescription')}
      </Text>
    </Center>
  )

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader title={t('importantDates.title')} />

      <Box w="$full" gap="$3" p="$6">
        <CalendarView
          dates={events.map((event) => ({
            id: String(event.id),
            title: event.title,
            date: format(parseISO(event.occurrence_start_time), 'yyyy-MM-dd'),
            type: 'event' as const,
          }))}
          selectedDate={format(selectedDate, 'yyyy-MM-dd')}
          onDayPress={(day) => setSelectedDate(parseISO(day.dateString))}
          onMonthChange={(month) =>
            setSelectedDate(
              parseISO(
                `${month.year}-${String(month.month).padStart(2, '0')}-01`,
              ),
            )
          }
        />
      </Box>

      {isLoading ? (
        <Center flex={1}>
          <Spinner size="large" color={colors.primary500} />
        </Center>
      ) : isError ? (
        <Center flex={1} px="$6">
          <Text color={colors.text} fontSize="$md" textAlign="center">
            {t('importantDates.errorLoading')}
          </Text>
          <Text
            color={colors.text}
            fontSize="$sm"
            textAlign="center"
            mt="$2"
            opacity={0.7}
          >
            {t('importantDates.errorRetry')}
          </Text>
        </Center>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) =>
            String((item as CalendarEventOccurrenceDTO).id)
          }
          renderItem={({ item }) => (
            <EventManagementCard
              event={item as CalendarEventOccurrenceDTO}
              onEdit={handleEditEvent}
            />
          )}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddRoundedButton onPress={handleAddNewDate} />
    </VStack>
  )
}
