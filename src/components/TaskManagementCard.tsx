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
import { useTranslation } from 'react-i18next'
import { translateApiError } from '@utils/translateApiError'

type Props = {
  task: HouseholdTaskDTO
  onEdit: (taskId: number) => void
}

export function TaskManagementCard({ task, onEdit }: Props) {
  const { colors } = useTheme()
  const toast = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const cancelRef = useRef(null)
  const { t } = useTranslation()

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
              title={t('components.taskManagementCard.deleteSuccess')}
              action="success"
              onClose={() => toast.close(id)}
            />
          ),
        })
        setShowDeleteDialog(false)
      },
      onError: (error) => {
        const description = translateApiError(error)

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title={t('components.taskManagementCard.deleteError')}
              description={description}
              action="error"
              onClose={() => toast.close(id)}
            />
          ),
        })
      },
    })
  }

  const formatRecurrenceRule = (rule: string | null) => {
    if (!rule) return t('components.taskManagementCard.unique')

    if (rule.includes('FREQ=DAILY'))
      return t('components.taskManagementCard.daily')
    if (rule.includes('FREQ=WEEKLY') && rule.includes('BYDAY')) {
      const days = rule.match(/BYDAY=([^;]+)/)?.[1]
      return t('components.taskManagementCard.weeklyDays', { days })
    }
    if (rule.includes('FREQ=WEEKLY'))
      return t('components.taskManagementCard.weekly')
    if (rule.includes('FREQ=MONTHLY'))
      return t('components.taskManagementCard.monthly')

    return t('components.taskManagementCard.custom')
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
              {t('components.taskManagementCard.startDate')}{' '}
              {new Date(task.start_date).toLocaleDateString('pt-BR')}
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
              {t('components.taskManagementCard.deleteDialogTitle')}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text color={colors.text}>
              {isRecurrent
                ? t(
                    'components.taskManagementCard.deleteDialogMessageRecurrent',
                  )
                : t('components.taskManagementCard.deleteDialogMessage')}
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
                  {t('components.taskManagementCard.deleteDialogCancel')}
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
                  {isPending
                    ? t('components.taskManagementCard.deleteDialogDeleting')
                    : t('components.taskManagementCard.deleteDialogConfirm')}
                </Text>
              </Pressable>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
