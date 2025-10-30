import { useState } from 'react'
import {
  Box,
  FlatList,
  VStack,
  Text,
  Pressable,
  Icon,
} from '@gluestack-ui/themed'
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
import { Tags } from 'lucide-react-native'
import { TaskForDayDTO } from '@dtos/HouseholdTaskDTO'

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
          <Pressable onPress={handleNavigateToManagement}>
            <Icon as={Tags} color={colors.primary600} size="xl" />
          </Pressable>
        }
      />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String((item as TaskForDayDTO).id)}
          renderItem={({ item }) => (
            <TaskCard task={item as TaskForDayDTO} currentDate={selectedDate} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          px="$6"
          pt="$4"
          ListHeaderComponent={
            <>
              <TaskSummary />
              <Box
                h={1}
                w="100%"
                bg={colors.border}
                mt="$4"
                mb="$2"
                opacity={0.5}
              />
              <DateNavigator
                selectedDate={selectedDate}
                onChangeDate={setSelectedDate}
              />
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
