import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Text,
  ScrollView,
  useToast,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Textarea,
  TextareaInput,
  Pressable,
  HStack,
  Switch,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ScreenHeader } from '@components/ScreenHeader'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Select } from '@components/Select'
import { ToastMessage } from '@components/ToastMessage'
import { useCalendarQueries } from '@hooks/api/useCalendarQueries'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarDays } from 'lucide-react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { Loading } from '@components/Loading'
import { useTranslation } from 'react-i18next'

type FormData = {
  title: string
  description?: string | null
  start_time: Date
  end_time: Date
  is_all_day: boolean
  recurrence_rule?: string | null
  category_id?: number | null
}

// Modo do seletor de data/hora
type DateTimePickerMode = 'date' | 'time'

// Tipo dos parâmetros da rota
type EventEditRouteParams = {
  eventId: number
}

export function EventEdit() {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const toast = useToast()

  const { eventId } = route.params as EventEditRouteParams

  // Esquema de validação Zod
  const editEventFormSchema = z
    .object({
      title: z
        .string({ required_error: t('eventEdit.titleRequired') })
        .min(1, t('eventEdit.titleRequired')),
      description: z.string().nullable().optional(),
      start_time: z.date(),
      end_time: z.date(),
      is_all_day: z.boolean().default(false),
      recurrence_rule: z.string().nullable().optional(),
      category_id: z.number().nullable().optional(),
    })
    .refine((data) => data.end_time >= data.start_time, {
      message: t('eventEdit.endDateError'),
      path: ['end_time'],
    })

  // Opções de Recorrência
  const recurrenceOptions = [
    { label: t('eventEdit.recurrenceNone'), value: null },
    { label: t('eventEdit.recurrenceDaily'), value: 'FREQ=DAILY' },
    { label: t('eventEdit.recurrenceWeekly'), value: 'FREQ=WEEKLY' },
    {
      label: t('eventEdit.recurrenceBiweekly'),
      value: 'FREQ=WEEKLY;INTERVAL=2',
    },
    { label: t('eventEdit.recurrenceMonthly'), value: 'FREQ=MONTHLY' },
    {
      label: t('eventEdit.recurrenceBimonthly'),
      value: 'FREQ=MONTHLY;INTERVAL=2',
    },
    { label: t('eventEdit.recurrenceYearly'), value: 'FREQ=YEARLY' },
  ]

  const {
    useFetchCalendarEvents,
    useFetchCalendarCategories,
    useUpdateCalendarEvent,
  } = useCalendarQueries()

  // Busca o evento específico
  // Note: A API retorna ocorrências por range, então precisamos buscar um range que inclua o evento
  const { data: events = [], isLoading: isLoadingEvent } =
    useFetchCalendarEvents('2020-01-01', '2030-12-31', true)
  const event = events.find((e) => e.id === eventId)

  const { mutate: updateEvent, isPending } = useUpdateCalendarEvent()

  // Busca as categorias
  const { data: categories, isLoading: isLoadingCategories } =
    useFetchCalendarCategories()

  // Formata as categorias para o componente Select
  const categoryOptions =
    categories?.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })) || []

  // --- State do Seletor de Data/Hora ---
  const [showPicker, setShowPicker] = useState(false)
  const [pickerMode, setPickerMode] = useState<DateTimePickerMode>('date')
  const [pickerTarget, setPickerTarget] = useState<keyof FormData>('start_time')

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    // @ts-expect-error - Zod default value type inference issue
    resolver: zodResolver(editEventFormSchema),
    defaultValues: {
      title: '',
      description: null,
      start_time: new Date(),
      end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
      is_all_day: false,
      recurrence_rule: null,
      category_id: null,
    },
  })

  const { start_time, end_time, is_all_day } = watch()

  // Carrega os dados do evento quando disponível
  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        start_time: new Date(event.start_time),
        end_time: new Date(event.end_time),
        is_all_day: event.is_all_day,
        recurrence_rule: event.recurrence_rule,
        category_id: event.category_id,
      })
    }
  }, [event, reset])

  // --- Handlers do Seletor de Data/Hora ---
  const showDateTimePicker = (
    target: keyof FormData,
    mode: DateTimePickerMode,
  ) => {
    setPickerTarget(target)
    setPickerMode(mode)
    setShowPicker(true)
  }

  const onPickerChange = (
    event: DateTimePickerEvent,
    date: Date | undefined,
  ) => {
    setShowPicker(false)
    if (event.type === 'set' && date) {
      const currentValue = watch(pickerTarget) as Date
      const newValue = new Date(currentValue)

      if (pickerMode === 'date') {
        newValue.setFullYear(date.getFullYear())
        newValue.setMonth(date.getMonth())
        newValue.setDate(date.getDate())
      } else {
        newValue.setHours(date.getHours())
        newValue.setMinutes(date.getMinutes())
      }

      setValue(pickerTarget, newValue, { shouldValidate: true })

      // Sincroniza end_time se for "Dia Inteiro"
      if (is_all_day && pickerTarget === 'start_time') {
        setValue('end_time', newValue, { shouldValidate: true })
      }
    }
  }

  // --- Handler do "Dia Inteiro" ---
  const handleToggleAllDay = (allDay: boolean) => {
    setValue('is_all_day', allDay, { shouldValidate: true })
    if (allDay) {
      setValue('end_time', watch('start_time'), { shouldValidate: true })
    }
  }

  // --- Handler de Submit ---
  const handleUpdateEvent = (data: FormData) => {
    updateEvent(
      { eventId, data },
      {
        onSuccess: () => {
          toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title={t('eventEdit.updateSuccess')}
                action="success"
                onClose={() => toast.close(id)}
              />
            ),
          })
          navigation.goBack()
        },
        onError: (error) => {
          toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                title={t('eventEdit.updateError')}
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

  // --- Helper de Formatação de Data/Hora ---
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  const formatDisplayTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Estados de carregamento
  if (isLoadingEvent || !event) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader title={t('eventEdit.title')} hasGoBackButton />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} px="$6" mt="$6">
          {/* Título */}
          <FormControl isInvalid={!!errors.title}>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('eventEdit.titleLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder={t('eventEdit.titlePlaceholder')}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  errorMessage={errors.title?.message}
                />
              )}
            />
          </FormControl>

          {/* Categoria */}
          <Controller
            control={control}
            name="category_id"
            render={({ field: { onChange, value } }) => (
              <Select
                label={t('eventEdit.categoryLabel')}
                items={categoryOptions}
                selectedValue={
                  value === null ? 'null' : value ? String(value) : 'null'
                }
                value={
                  categoryOptions.find((opt) => opt.value === value)?.label ||
                  t('eventEdit.categoryNone')
                }
                onValueChange={(val) =>
                  onChange(val === 'null' ? null : Number(val))
                }
                errorMessage={errors.category_id?.message}
                mt="$4"
                placeholder={t('eventEdit.categoryNone')}
                isLoading={isLoadingCategories}
              />
            )}
          />

          {/* Dia Inteiro */}
          <Controller
            control={control}
            name="is_all_day"
            render={({ field: { value } }) => (
              <FormControl mt="$5">
                <HStack justifyContent="space-between" alignItems="center">
                  <FormControlLabelText color={colors.text}>
                    {t('eventEdit.allDayLabel')}
                  </FormControlLabelText>
                  <Switch
                    value={value}
                    onToggle={handleToggleAllDay}
                    trackColor={{
                      false: colors.border,
                      true: colors.primary500,
                    }}
                  />
                </HStack>
              </FormControl>
            )}
          />

          {/* Data/Hora Início */}
          <FormControl isInvalid={!!errors.start_time} mt="$4">
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('eventEdit.startLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <HStack space="md">
              <Pressable
                onPress={() => showDateTimePicker('start_time', 'date')}
                bg={colors.card}
                borderColor={colors.border}
                borderWidth={1}
                borderRadius="$md"
                h={50}
                flex={1}
                px="$4"
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
              >
                <Text color={colors.text}>{formatDisplayDate(start_time)}</Text>
                <CalendarDays size={20} color={colors.text} />
              </Pressable>
              {!is_all_day && (
                <Pressable
                  onPress={() => showDateTimePicker('start_time', 'time')}
                  bg={colors.card}
                  borderColor={colors.border}
                  borderWidth={1}
                  borderRadius="$md"
                  h={50}
                  w="$24"
                  px="$4"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color={colors.text}>
                    {formatDisplayTime(start_time)}
                  </Text>
                </Pressable>
              )}
            </HStack>
          </FormControl>

          {/* Data/Hora Fim */}
          <FormControl isInvalid={!!errors.end_time} mt="$4">
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('eventEdit.endLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <HStack space="md">
              <Pressable
                onPress={() => showDateTimePicker('end_time', 'date')}
                bg={colors.card}
                borderColor={errors.end_time ? '$error500' : colors.border}
                borderWidth={1}
                borderRadius="$md"
                h={50}
                flex={1}
                px="$4"
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
                opacity={is_all_day ? 0.5 : 1}
                disabled={is_all_day}
              >
                <Text color={colors.text}>{formatDisplayDate(end_time)}</Text>
                <CalendarDays size={20} color={colors.text} />
              </Pressable>
              {!is_all_day && (
                <Pressable
                  onPress={() => showDateTimePicker('end_time', 'time')}
                  bg={colors.card}
                  borderColor={errors.end_time ? '$error500' : colors.border}
                  borderWidth={1}
                  borderRadius="$md"
                  h={50}
                  w="$24"
                  px="$4"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color={colors.text}>{formatDisplayTime(end_time)}</Text>
                </Pressable>
              )}
            </HStack>
            {/* Exibe erro de data final < data inicial */}
            {errors.end_time && (
              <Text color="$error500" fontSize="$sm" mt="$1">
                {errors.end_time.message}
              </Text>
            )}
          </FormControl>

          {/* Recorrência */}
          <Controller
            control={control}
            name="recurrence_rule"
            render={({ field: { onChange, value } }) => (
              <Select
                label={t('eventEdit.recurrenceLabel')}
                items={recurrenceOptions}
                selectedValue={value === null ? 'null' : value || 'null'}
                value={
                  recurrenceOptions.find((opt) => opt.value === value)?.label ||
                  t('eventEdit.recurrenceNone')
                }
                onValueChange={(val) => onChange(val === 'null' ? null : val)}
                errorMessage={errors.recurrence_rule?.message}
                mt="$4"
              />
            )}
          />

          {/* Descrição */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl mt="$4">
                <FormControlLabel>
                  <FormControlLabelText color={colors.text}>
                    {t('eventEdit.descriptionLabel')}
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea
                  size="md"
                  w="100%"
                  bg={colors.card}
                  borderColor={colors.border}
                  borderRadius="$md"
                  $focus-borderColor={colors.primary500}
                >
                  <TextareaInput
                    placeholder={t('eventEdit.descriptionPlaceholder')}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    color={colors.text}
                    h={100}
                    textAlignVertical="top"
                  />
                </Textarea>
              </FormControl>
            )}
          />

          {/* Botão Salvar */}
          <Box mt="$8">
            <Button
              title={t('eventEdit.saveButton')}
              onPress={handleSubmit(handleUpdateEvent as never)}
              isLoading={isPending}
            />
          </Box>
        </VStack>
      </ScrollView>

      {/* Modal de Picker (iOS/Android) */}
      {showPicker && (
        <DateTimePicker
          value={watch(pickerTarget) as Date}
          mode={pickerMode}
          display="spinner"
          onChange={onPickerChange}
        />
      )}
    </VStack>
  )
}
