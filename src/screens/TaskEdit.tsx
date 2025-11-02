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
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ScreenHeader } from '@components/ScreenHeader'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Select } from '@components/Select'
import { ToastMessage } from '@components/ToastMessage'
import { WeekDaySelector, WeekDay } from '@components/WeekDaySelector'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, CalendarDays } from 'lucide-react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { TaskDetailsRouteParams } from '@routes/tasks.routes'
import { Loading } from '@components/Loading'
import {
  RecurrenceType,
  getRecurrenceOptions,
  getRecurrenceRule,
  getRecurrenceTypeFromRule,
  getWeekDaysFromRule,
} from '@utils/recurrenceTypes'
import { useTranslation } from 'react-i18next'
import { translateApiError } from '@utils/translateApiError'

export function TaskEdit() {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const toast = useToast()

  const { taskId } = route.params as TaskDetailsRouteParams

  // Esquema de validação Zod
  const editTaskFormSchema = z.object({
    title: z
      .string({ required_error: t('taskEdit.titleRequired') })
      .min(1, t('taskEdit.titleRequired')),
    description: z.string().nullable().optional(),
    start_date: z.date({ required_error: t('taskEdit.startDateRequired') }),
    recurrence_rule: z.string().nullable().optional(),
  })

  type FormData = z.infer<typeof editTaskFormSchema>

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

      // Determina o tipo de recorrência usando a função compartilhada
      const type = getRecurrenceTypeFromRule(task.recurrence_rule)
      setRecurrenceType(type)

      // Se for custom, extrai os dias da semana
      if (type === 'custom') {
        const days = getWeekDaysFromRule(task.recurrence_rule) as WeekDay[]
        setSelectedWeekDays(days)
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

    // Mapeia o tipo de recorrência para a regra RRULE usando a função compartilhada
    const rule = getRecurrenceRule(type, selectedWeekDays)
    setValue('recurrence_rule', rule)
  }

  const handleWeekDaysChange = (days: WeekDay[]) => {
    setSelectedWeekDays(days)
    const rule = getRecurrenceRule('custom', days)
    setValue('recurrence_rule', rule)
  }

  const handleUpdateTask = (data: FormData) => {
    // Converte 'none' para null antes de enviar
    const payload = {
      ...data,
      recurrence_rule:
        data.recurrence_rule === 'none' ? null : data.recurrence_rule,
    }

    updateTask(
      { taskId, data: payload },
      {
        onSuccess: () => {
          toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title={t('taskEdit.updateSuccess')}
                action="success"
                onClose={() => toast.close(id)}
              />
            ),
          })
          navigation.goBack()
        },
        onError: (error) => {
          const description = translateApiError(error)

          toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title={t('taskEdit.updateError')}
                description={description}
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
        <ScreenHeader title={t('taskEdit.title')} hasGoBackButton />
        <Loading />
      </VStack>
    )
  }

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader title={t('taskEdit.title')} hasGoBackButton />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} px="$6" mt="$6">
          {/* Título */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('taskEdit.titleLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder={t('taskEdit.titlePlaceholder')}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  errorMessage={errors.title?.message}
                />
              )}
            />
          </FormControl>

          {/* Descrição */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl isInvalid={!!errors.description} mt="$4">
                <FormControlLabel>
                  <FormControlLabelText color={colors.text}>
                    {t('taskEdit.descriptionLabel')}
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
                    placeholder={t('taskEdit.descriptionPlaceholder')}
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
                    {t('taskEdit.startDateLabel')}
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
          <Select
            label={t('taskEdit.recurrenceLabel')}
            items={getRecurrenceOptions()}
            placeholder={t('taskEdit.recurrencePlaceholder')}
            selectedValue={recurrenceType}
            value={
              getRecurrenceOptions().find((opt) => opt.value === recurrenceType)
                ?.label || t('utils.recurrenceTypes.none')
            }
            onValueChange={handleRecurrenceChange}
            mt="$4"
          />

          {/* Seletor de dias da semana - mostrar apenas se recorrência for 'custom' */}
          {recurrenceType === 'custom' && (
            <FormControl mt="$4">
              <FormControlLabel>
                <FormControlLabelText color={colors.text}>
                  {t('taskEdit.weekDaysLabel')}
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
              title={t('taskEdit.saveButton')}
              onPress={handleSubmit(handleUpdateTask)}
              isLoading={isPending}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
