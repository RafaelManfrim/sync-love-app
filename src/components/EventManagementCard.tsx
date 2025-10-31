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
import { CalendarEventOccurrenceDTO } from '@dtos/CalendarEventDTO'
import { Pencil, Trash2, Clock, Tag } from 'lucide-react-native'
import { useState, useRef } from 'react'
import { useCalendarQueries } from '@hooks/api/useCalendarQueries'
import { ToastMessage } from './ToastMessage'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Props = {
  event: CalendarEventOccurrenceDTO
  onEdit: (eventId: number) => void
}

export function EventManagementCard({ event, onEdit }: Props) {
  const { colors } = useTheme()
  const toast = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const cancelRef = useRef(null)

  const { useDeleteCalendarEvent } = useCalendarQueries()
  const { mutate: deleteEvent, isPending } = useDeleteCalendarEvent()

  const isRecurrent = !!event.recurrence_rule

  const handleDelete = () => {
    deleteEvent(event.id, {
      onSuccess: () => {
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Evento excluído com sucesso!"
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
              title="Erro ao excluir evento"
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
    if (!rule) return 'Evento único'

    if (rule.includes('FREQ=DAILY')) return 'Diariamente'
    if (rule.includes('FREQ=WEEKLY')) {
      if (rule.includes('INTERVAL=2')) return 'A cada duas semanas'
      return 'Semanalmente'
    }
    if (rule.includes('FREQ=MONTHLY')) {
      if (rule.includes('INTERVAL=2')) return 'A cada dois meses'
      return 'Mensalmente'
    }
    if (rule.includes('FREQ=YEARLY')) return 'Anualmente'

    return 'Recorrência personalizada'
  }

  const formatDateTime = (dateString: string, isAllDay: boolean) => {
    const date = parseISO(dateString)
    if (isAllDay) {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    }
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  return (
    <>
      <Pressable onPress={() => onEdit(event.id)}>
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
              {event.title}
            </Text>
            {event.description && (
              <Text color={colors.text} fontSize="$sm" opacity={0.7} mb="$1">
                {event.description}
              </Text>
            )}

            {event.category && (
              <HStack alignItems="center" gap="$1" mb="$1">
                <Tag size={12} color={colors.primary500} />
                <Text
                  color={colors.primary500}
                  fontSize="$xs"
                  fontFamily="$body"
                >
                  {event.category.name}
                </Text>
              </HStack>
            )}

            <HStack alignItems="center" gap="$1" mb="$1">
              <Clock size={12} color={colors.text} opacity={0.6} />
              <Text color={colors.text} fontSize="$xs" opacity={0.6}>
                {formatDateTime(event.start_time, event.is_all_day)}
              </Text>
            </HStack>

            <Text color={colors.primary500} fontSize="$xs" fontFamily="$body">
              {formatRecurrenceRule(event.recurrence_rule)}
            </Text>
          </VStack>

          <HStack gap="$2">
            <Pressable
              onPress={() => onEdit(event.id)}
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
              Excluir Evento
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text color={colors.text}>
              {isRecurrent
                ? 'Tem certeza que deseja excluir este evento recorrente? Todas as ocorrências futuras serão removidas.'
                : 'Tem certeza que deseja excluir este evento?'}
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
