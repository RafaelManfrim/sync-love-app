import { useState } from 'react'
import { Box, FlatList, VStack, Text, Pressable } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ScreenHeader } from '@components/ScreenHeader'
import { Loading } from '@components/Loading'
import { DateNavigator } from '@components/DateNavigator'
import { TaskCard } from '@components/TaskCard'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { useNavigation } from '@react-navigation/native'
import { TasksNavigationRoutesProps } from '@routes/tasks.routes'
import { TaskSummary } from '@components/TaskSummary'
import { AddRoundedButton } from '@components/AddRoundedButton'
import { Settings } from 'lucide-react-native'

export function Tasks() {
  const { colors } = useTheme()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const navigation = useNavigation<TasksNavigationRoutesProps>()

  const { useFetchTasksByDay } = useHouseholdTaskQueries()

  // Formata a data para a API (YYYY-MM-DD)
  const formattedDate = selectedDate.toISOString().split('T')[0]

  const {
    data: tasks,
    isLoading,
    isRefetching,
    refetch,
  } = useFetchTasksByDay(formattedDate)

  const handleNavigateToNewTask = () => {
    navigation.navigate('taskCreate')
  }

  const handleNavigateToManagement = () => {
    navigation.navigate('taskManagement')
  }

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader
        title="Tarefas"
        rightComponent={
          <Pressable onPress={handleNavigateToManagement} p="$2">
            <Settings size={24} color={colors.text} />
          </Pressable>
        }
      />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskCard task={item} currentDate={selectedDate} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          px="$4"
          ListHeaderComponent={
            <>
              {/* O sumário mensal que acabamos de criar */}
              <TaskSummary />

              {/* O navegador diário, agora dentro da área de rolagem */}
              <DateNavigator
                selectedDate={selectedDate}
                onChangeDate={setSelectedDate}
              />

              {/* Título para a seção de tarefas do dia */}
              <Text
                px="$4"
                mb="$3"
                fontFamily="$heading"
                fontSize="$lg"
                color={colors.text}
              >
                Tarefas do Dia
              </Text>
            </>
          }
          ListFooterComponent={<Box h={100} />}
          ListEmptyComponent={() => (
            <Box h="$40" justifyContent="center" alignItems="center">
              <Text color={colors.text} opacity={0.6}>
                Nenhuma tarefa para este dia.
              </Text>
            </Box>
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddRoundedButton onPress={handleNavigateToNewTask} />
    </VStack>
  )
}
