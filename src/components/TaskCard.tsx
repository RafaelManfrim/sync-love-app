import {
  HStack,
  Text,
  VStack,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
  CloseIcon,
  Pressable,
  Spinner,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { TaskForDayDTO } from '@dtos/HouseholdTaskDTO'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { UserPhoto } from './UserPhoto'
import { useAuth } from '@hooks/useAuth'
import DefaultUserPhoto from '@assets/userPhotoDefault.png'
import { api } from '@services/api'

type Props = {
  task: TaskForDayDTO
  currentDate: Date
}

export function TaskCard({ task, currentDate }: Props) {
  const { colors } = useTheme()
  const { user } = useAuth()
  const {
    useCompleteTask,
    useUncompleteTask,
    useCreateTaskException,
    invalidateTasksQueries,
  } = useHouseholdTaskQueries()

  // --- States ---
  const isCompleted = !!task.completion
  const isCancelled = !!task.exception
  const whoCompleted = task.completion?.completed_by
  const isMe = whoCompleted?.id === user.id

  // --- Mutations ---
  const { mutate: completeTask, isPending: isCompleting } = useCompleteTask()
  const { mutate: uncompleteTask, isPending: isUncompleting } =
    useUncompleteTask()
  const { mutate: createException, isPending: isCancelling } =
    useCreateTaskException()

  const isLoading = isCompleting || isUncompleting || isCancelling

  // --- Handlers ---
  const handleToggleCompletion = () => {
    if (isLoading || isCancelled) return

    if (isCompleted && task.completion) {
      // Uncomplete
      uncompleteTask(task.completion.id, {
        onSuccess: () => invalidateTasksQueries(currentDate),
      })
    } else {
      // Complete
      completeTask({ taskId: task.id, taskDueDate: currentDate })
    }
  }

  const handleCancelTask = () => {
    // Ação de "long press" ou menu (ex: "Cancelar hoje")
    if (isLoading || isCancelled) return
    createException({ taskId: task.id, exceptionDate: currentDate })
  }

  // Define o ícone do checkbox
  const CheckboxStateIcon = isCancelled ? CloseIcon : CheckIcon

  return (
    // Usamos Pressable para futuras ações (ex: long press para cancelar/editar)
    <Pressable
      onLongPress={handleCancelTask}
      // onPress={() => navigateToTaskDetails(task.id)}
    >
      <HStack
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        bg={colors.card}
        p="$4"
        borderRadius="$md"
        mb="$3"
        opacity={isCancelled ? 0.4 : 1}
      >
        <HStack alignItems="center" flex={1}>
          <Checkbox
            size="lg"
            isInvalid={isCancelled} // Se cancelado, mostra X
            isChecked={isCompleted}
            isDisabled={isCancelled}
            onChange={handleToggleCompletion}
            aria-label={`Marcar ${task.title}`}
            value={task.title}
            mr="$3"
          >
            <CheckboxIndicator
              $checked-bg={colors.primary500}
              $checked-borderColor={colors.primary600}
            >
              <CheckboxIcon
                as={CheckboxStateIcon}
                color={colors.textContrast}
              />
            </CheckboxIndicator>
          </Checkbox>

          <VStack flex={1}>
            <Text
              color={colors.text}
              fontSize="$md"
              fontFamily="$body"
              strikeThrough={isCompleted || isCancelled}
            >
              {task.title}
            </Text>
            {task.description && (
              <Text
                color={colors.text}
                fontSize="$sm"
                opacity={0.7}
                strikeThrough={isCompleted || isCancelled}
              >
                {task.description}
              </Text>
            )}
          </VStack>
        </HStack>

        {whoCompleted ? (
          <UserPhoto
            w="$5"
            h="$5"
            source={
              whoCompleted.avatar_url
                ? {
                    uri: `${api.defaults.baseURL}/tmp/uploads/avatar/${whoCompleted.avatar_url}`,
                  }
                : DefaultUserPhoto
            }
            borderColor={isMe ? colors.primary500 : colors.card}
            borderWidth={isMe ? 2 : 0}
          />
        ) : isLoading ? (
          <Spinner color={colors.primary500} />
        ) : null}
      </HStack>
    </Pressable>
  )
}
