import { useEffect, useState } from 'react'
import {
  Box,
  VStack,
  Text,
  ScrollView,
  useToast,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Textarea,
  TextareaInput,
  Pressable,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ScreenHeader } from '@components/ScreenHeader'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { ToastMessage } from '@components/ToastMessage'
import { WeekDaySelector, WeekDay } from '@components/WeekDaySelector'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  AlertTriangle,
  CalendarDays,
  ChevronDownIcon,
} from 'lucide-react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { TaskDetailsRouteParams } from '@routes/tasks.routes'
import { Loading } from '@components/Loading'

// Esquema de validação Zod
const editTaskFormSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório.' })
    .min(1, 'O título é obrigatório.'),
  description: z.string().nullable().optional(),
  start_date: z.date({ required_error: 'A data de início é obrigatória.' }),
  recurrence_rule: z.string().nullable().optional(),
})

type FormData = z.infer<typeof editTaskFormSchema>

// Tipos de Recorrência
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'custom' | 'monthly'

// Opções de Recorrência
const recurrenceOptions = [
  { label: 'Não se repete', value: 'none' },
  { label: 'Diariamente', value: 'daily' },
  { label: 'Semanalmente', value: 'weekly' },
  { label: 'Personalizado (dias da semana)', value: 'custom' },
  { label: 'Mensalmente', value: 'monthly' },
]

export function TaskEdit() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const toast = useToast()

  const { taskId } = route.params as TaskDetailsRouteParams

  const { useFetchTaskDetails, useUpdateTask } = useHouseholdTaskQueries()
  const { data: task, isLoading: isLoadingTask } = useFetchTaskDetails(taskId)
  const { mutate: updateTask, isPending } = useUpdateTask()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none')
  const [selectedWeekDays, setSelectedWeekDays] = useState<WeekDay[]>([])

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(editTaskFormSchema),
    defaultValues: {
      title: '',
      description: null,
      start_date: new Date(),
      recurrence_rule: null,
    },
  })

  const selectedDate = watch('start_date')

  // Carrega os dados da tarefa quando disponível
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        start_date: new Date(task.start_date),
        recurrence_rule: task.recurrence_rule,
      })

      // Determina o tipo de recorrência
      if (!task.recurrence_rule) {
        setRecurrenceType('none')
      } else if (task.recurrence_rule.includes('FREQ=DAILY')) {
        setRecurrenceType('daily')
      } else if (
        task.recurrence_rule.includes('FREQ=WEEKLY') &&
        task.recurrence_rule.includes('BYDAY')
      ) {
        setRecurrenceType('custom')
        // Extrai os dias da semana
        const match = task.recurrence_rule.match(/BYDAY=([^;]+)/)
        if (match) {
          const days = match[1].split(',') as WeekDay[]
          setSelectedWeekDays(days)
        }
      } else if (task.recurrence_rule.includes('FREQ=WEEKLY')) {
        setRecurrenceType('weekly')
      } else if (task.recurrence_rule.includes('FREQ=MONTHLY')) {
        setRecurrenceType('monthly')
      }
    }
  }, [task, reset])

  const handleDateChange = (
    event: DateTimePickerEvent,
    date: Date | undefined,
  ) => {
    setShowDatePicker(false)
    if (event.type === 'set' && date) {
      setValue('start_date', date, { shouldValidate: true })
    }
  }

  const handleRecurrenceChange = (value: string) => {
    const type = value as RecurrenceType
    setRecurrenceType(type)

    // Mapeia o tipo de recorrência para a regra RRULE
    switch (type) {
      case 'none':
        setValue('recurrence_rule', null)
        break
      case 'daily':
        setValue('recurrence_rule', 'FREQ=DAILY')
        break
      case 'weekly':
        setValue('recurrence_rule', 'FREQ=WEEKLY')
        break
      case 'monthly':
        setValue('recurrence_rule', 'FREQ=MONTHLY')
        break
      case 'custom':
        // Será definido quando os dias forem selecionados
        if (selectedWeekDays.length > 0) {
          const byday = selectedWeekDays.join(',')
          setValue('recurrence_rule', `FREQ=WEEKLY;BYDAY=${byday}`)
        } else {
          setValue('recurrence_rule', null)
        }
        break
      default:
        setValue('recurrence_rule', null)
    }
  }

  const handleWeekDaysChange = (days: WeekDay[]) => {
    setSelectedWeekDays(days)
    if (days.length > 0) {
      const byday = days.join(',')
      setValue('recurrence_rule', `FREQ=WEEKLY;BYDAY=${byday}`)
    } else {
      setValue('recurrence_rule', null)
    }
  }

  const handleUpdateTask = (data: FormData) => {
    updateTask(
      { taskId, data },
      {
        onSuccess: () => {
          toast.show({
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Tarefa atualizada com sucesso!"
                action="success"
                onClose={() => toast.close(id)}
              />
            ),
          })
          navigation.goBack()
        },
        onError: (error) => {
          toast.show({
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title="Erro ao atualizar tarefa"
                description={error.message}
                action="error"
                onClose={() => toast.close(id)}
              />
            ),
          })
        },
      },
    )
  }

  if (isLoadingTask) {
    return (
      <VStack flex={1} bg={colors.background}>
        <ScreenHeader title="Editar Tarefa" hasGoBackButton />
        <Loading />
      </VStack>
    )
  }

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader title="Editar Tarefa" hasGoBackButton />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} px="$6" mt="$6">
          {/* Título */}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Ex: Lavar a louça"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                errorMessage={errors.title?.message}
              />
            )}
          />

          {/* Descrição */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.description} mt="$4">
                <FormControlLabel>
                  <FormControlLabelText color={colors.text}>
                    Descrição (Opcional)
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea
                  size="md"
                  w="100%"
                  bg={colors.card}
                  borderColor={colors.border}
                  borderRadius="$md"
                  $focus-borderColor={colors.primary500}
                  isInvalid={!!errors.description}
                >
                  <TextareaInput
                    placeholder="Ex: Tirar o lixo também"
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    color={colors.text}
                  />
                </Textarea>
              </FormControl>
            )}
          />

          {/* Data de Início / Vencimento */}
          <Controller
            control={control}
            name="start_date"
            render={() => (
              <FormControl isInvalid={!!errors.start_date} mt="$4">
                <FormControlLabel>
                  <FormControlLabelText color={colors.text}>
                    Data de Início (ou Vencimento)
                  </FormControlLabelText>
                </FormControlLabel>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  bg={colors.card}
                  borderWidth={1}
                  borderColor={errors.start_date ? '$error500' : colors.border}
                  borderRadius="$md"
                  h={50}
                  px="$4"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection="row"
                >
                  <Text color={colors.text}>
                    {selectedDate.toLocaleDateString('pt-BR')}
                  </Text>
                  <CalendarDays size={20} color={colors.text} />
                </Pressable>
                {errors.start_date && (
                  <FormControlError>
                    <FormControlErrorIcon
                      as={() => <AlertTriangle size={16} color="$error500" />}
                    />
                    <FormControlErrorText>
                      {errors.start_date.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />

          {/* Seletor de Data (Modal) */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}

          {/* Recorrência */}
          <FormControl mt="$4">
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                Repetir
              </FormControlLabelText>
            </FormControlLabel>
            <Select
              w="100%"
              h="$12"
              selectedValue={recurrenceType}
              onValueChange={handleRecurrenceChange}
            >
              <SelectTrigger
                variant="outline"
                h="$12"
                w="$full"
                bg={colors.card}
                borderColor={colors.border}
              >
                <SelectInput
                  placeholder="Escolha a repetição"
                  placeholderTextColor={colors.textInactive}
                  color={colors.text}
                />
                <SelectIcon
                  as={ChevronDownIcon}
                  mr="$3"
                  color={colors.textInactive}
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent pb="$16" bg={colors.card}>
                  <SelectDragIndicatorWrapper py="$4">
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {recurrenceOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          {/* Seletor de dias da semana - mostrar apenas se recorrência for 'custom' */}
          {recurrenceType === 'custom' && (
            <FormControl mt="$4">
              <FormControlLabel>
                <FormControlLabelText color={colors.text}>
                  Dias da Semana
                </FormControlLabelText>
              </FormControlLabel>
              <WeekDaySelector
                selectedDays={selectedWeekDays}
                onDaysChange={handleWeekDaysChange}
              />
            </FormControl>
          )}

          {/* Botão Salvar */}
          <Box mt="$8">
            <Button
              title="Salvar Alterações"
              onPress={handleSubmit(handleUpdateTask)}
              isLoading={isPending}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
