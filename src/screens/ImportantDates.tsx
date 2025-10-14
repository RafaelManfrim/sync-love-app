import { Button } from '@components/Button'
import { CalendarView } from '@components/CalendarView'
import { DateCard } from '@components/DateCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Box, Center, FlatList, Text, VStack } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'

const MOCK_DATES = [
  {
    id: '1',
    title: 'Aniversário de Namoro',
    date: '2025-11-20',
    type: 'anniversary' as const,
  },
  {
    id: '2',
    title: 'Aniversário da Maria',
    date: '2026-01-15',
    type: 'birthday' as const,
  },
  {
    id: '3',
    title: 'Viagem para a praia',
    date: '2025-12-22',
    type: 'event' as const,
  },
  {
    id: '4',
    title: 'Aniversário do João',
    date: '2025-10-28',
    type: 'birthday' as const,
  },
  {
    id: '5',
    title: 'Show do Coldplay',
    date: '2026-03-10',
    type: 'event' as const,
  },
].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Ordena por data

export function ImportantDates() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  )

  const navigation = useNavigation()

  function handleAddNewDate() {
    // Ação para adicionar nova data (futuramente navegará para outra tela)
    console.log('Abrir tela para adicionar nova data importante.')
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Datas Importantes" />

      <Box w="$full" gap="$3" p="$6">
        <CalendarView
          dates={MOCK_DATES}
          selectedDate={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
        />
      </Box>

      <FlatList
        data={MOCK_DATES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DateCard title={item.title} date={item.date} type={item.type} />
        )}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={() => (
          <Text color="$gray300" textAlign="center" mt="$8">
            Nenhuma data importante cadastrada.
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Center w="$full" gap="$3" p="$6">
        <Button
          title="Adicionar Nova Data"
          onPress={handleAddNewDate}
          // isLoading={isSubmitting}
        />
      </Center>
    </VStack>
  )
}
