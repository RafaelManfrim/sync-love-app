import {
  HStack,
  Text,
  VStack,
  Pressable,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Heading,
  useToast,
  ButtonGroup,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { HouseholdTaskDTO } from '@dtos/HouseholdTaskDTO'
import { Pencil, Trash2 } from 'lucide-react-native'
import { useState, useRef } from 'react'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { ToastMessage } from './ToastMessage'

type Props = {
  task: HouseholdTaskDTO
  onEdit: (taskId: number) => void
}

export function TaskManagementCard({ task, onEdit }: Props) {
  const { colors } = useTheme()
  const toast = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const cancelRef = useRef(null)

  const { useDeleteTask } = useHouseholdTaskQueries()
  const { mutate: deleteTask, isPending } = useDeleteTask()

  const isRecurrent = !!task.recurrence_rule

  const handleDelete = () => {
    deleteTask(task.id, {
      onSuccess: () => {
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Tarefa excluída com sucesso!"
              action="success"
              onClose={() => toast.close(id)}
            />
          ),
        })
        setShowDeleteDialog(false)
      },
      onError: (error) => {
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Erro ao excluir tarefa"
              description={error.message}
              action="error"
              onClose={() => toast.close(id)}
            />
          ),
        })
      },
    })
  }

  const formatRecurrenceRule = (rule: string | null) => {
    if (!rule) return 'Única'

    if (rule.includes('FREQ=DAILY')) return 'Diariamente'
    if (rule.includes('FREQ=WEEKLY') && rule.includes('BYDAY')) {
      const days = rule.match(/BYDAY=([^;]+)/)?.[1]
      return `Semanalmente (${days})`
    }
    if (rule.includes('FREQ=WEEKLY')) return 'Semanalmente'
    if (rule.includes('FREQ=MONTHLY')) return 'Mensalmente'

    return 'Personalizada'
  }

  return (
    <>
      <Pressable onPress={() => onEdit(task.id)}>
        <HStack
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          bg={colors.card}
          p="$4"
          borderRadius="$md"
          mb="$3"
        >
          <VStack flex={1}>
            <Text
              color={colors.text}
              fontSize="$md"
              fontFamily="$heading"
              mb="$1"
            >
              {task.title}
            </Text>
            {task.description && (
              <Text color={colors.text} fontSize="$sm" opacity={0.7} mb="$1">
                {task.description}
              </Text>
            )}
            <Text color={colors.primary500} fontSize="$xs" fontFamily="$body">
              {formatRecurrenceRule(task.recurrence_rule)}
            </Text>
            <Text color={colors.text} fontSize="$xs" opacity={0.6}>
              Início: {new Date(task.start_date).toLocaleDateString('pt-BR')}
            </Text>
          </VStack>

          <HStack gap="$2">
            <Pressable
              onPress={() => onEdit(task.id)}
              p="$2"
              borderRadius="$md"
              bg={colors.primary500}
              opacity={0.8}
            >
              <Pencil size={20} color="white" />
            </Pressable>

            <Pressable
              onPress={() => setShowDeleteDialog(true)}
              p="$2"
              borderRadius="$md"
              bg="$error500"
              opacity={0.8}
            >
              <Trash2 size={20} color="white" />
            </Pressable>
          </HStack>
        </HStack>
      </Pressable>

      <AlertDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent bg={colors.card}>
          <AlertDialogHeader>
            <Heading size="lg" color={colors.title}>
              Excluir Tarefa
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text color={colors.text}>
              {isRecurrent
                ? 'Tem certeza que deseja excluir esta tarefa recorrente? Todas as ocorrências futuras serão removidas.'
                : 'Tem certeza que deseja excluir esta tarefa?'}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup space="lg">
              <Pressable
                onPress={() => setShowDeleteDialog(false)}
                p="$2"
                borderRadius="$md"
              >
                <Text color={colors.textInactive} fontWeight="$medium">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                disabled={isPending}
                p="$2"
                borderRadius="$md"
                bg={isPending ? '$trueGray200' : '$red50'}
                $hover-bg="$red100"
              >
                <Text
                  color={isPending ? '$trueGray500' : '$error500'}
                  fontWeight="$semibold"
                >
                  {isPending ? 'Excluindo...' : 'Sim, excluir'}
                </Text>
              </Pressable>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
