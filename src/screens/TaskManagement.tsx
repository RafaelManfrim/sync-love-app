import { useState } from 'react'
import {
  Box,
  FlatList,
  VStack,
  Text,
  HStack,
  Pressable,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ScreenHeader } from '@components/ScreenHeader'
import { Loading } from '@components/Loading'
import { TaskManagementCard } from '@components/TaskManagementCard'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { useNavigation } from '@react-navigation/native'
import { TasksNavigationRoutesProps } from '@routes/tasks.routes'

type Tab = 'unique' | 'recurrent'

export function TaskManagement() {
  const { colors } = useTheme()
  const [selectedTab, setSelectedTab] = useState<Tab>('recurrent')
  const navigation = useNavigation<TasksNavigationRoutesProps>()

  const { useFetchAllTasks } = useHouseholdTaskQueries()
  const {
    data: allTasks,
    isLoading,
    isRefetching,
    refetch,
  } = useFetchAllTasks()

  const handleEdit = (taskId: number) => {
    navigation.navigate('taskEdit', { taskId })
  }

  // Separa tarefas únicas e recorrentes
  const uniqueTasks = allTasks?.filter((task) => !task.recurrence_rule) || []
  const recurrentTasks = allTasks?.filter((task) => task.recurrence_rule) || []

  const tasksToShow = selectedTab === 'unique' ? uniqueTasks : recurrentTasks

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader title="Gerenciar Tarefas" hasGoBackButton />

      {/* Tabs */}
      <HStack w="100%" px="$4" mt="$4" mb="$2">
        <Pressable
          flex={1}
          onPress={() => setSelectedTab('recurrent')}
          py="$3"
          borderBottomWidth={2}
          borderBottomColor={
            selectedTab === 'recurrent' ? colors.primary500 : 'transparent'
          }
        >
          <Text
            textAlign="center"
            color={
              selectedTab === 'recurrent' ? colors.primary500 : colors.text
            }
            fontFamily="$heading"
            fontSize="$md"
          >
            Recorrentes ({recurrentTasks.length})
          </Text>
        </Pressable>

        <Pressable
          flex={1}
          onPress={() => setSelectedTab('unique')}
          py="$3"
          borderBottomWidth={2}
          borderBottomColor={
            selectedTab === 'unique' ? colors.primary500 : 'transparent'
          }
        >
          <Text
            textAlign="center"
            color={selectedTab === 'unique' ? colors.primary500 : colors.text}
            fontFamily="$heading"
            fontSize="$md"
          >
            Únicas ({uniqueTasks.length})
          </Text>
        </Pressable>
      </HStack>

      {/* Lista de Tarefas */}
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={tasksToShow}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskManagementCard task={item} onEdit={handleEdit} />
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
          px="$4"
          pt="$4"
          ListEmptyComponent={() => (
            <Box h="$40" justifyContent="center" alignItems="center">
              <Text color={colors.text} opacity={0.6} textAlign="center">
                {selectedTab === 'unique'
                  ? 'Nenhuma tarefa única cadastrada.'
                  : 'Nenhuma tarefa recorrente cadastrada.'}
              </Text>
            </Box>
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  )
}
