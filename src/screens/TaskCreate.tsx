import { useState } from 'react'
import {
  Box,
  VStack,
  Text,
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
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, CalendarDays } from 'lucide-react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  RecurrenceType,
  getRecurrenceOptions,
  getRecurrenceRule,
} from '@utils/recurrenceTypes'
import { useTranslation } from 'react-i18next'
import { translateApiError } from '@utils/translateApiError'
import { useLanguage } from '@hooks/useLanguage'

export function TaskCreate() {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const navigation = useNavigation()
  const toast = useToast()

  // Esquema de validação Zod
  const createTaskFormSchema = z.object({
    title: z
      .string({ required_error: t('taskCreate.titleRequired') })
      .min(1, t('taskCreate.titleRequired')),
    description: z.string().nullable().optional(),
    startDate: z.date({ required_error: t('taskCreate.startDateRequired') }),
    recurrenceRule: z.string().nullable().optional(),
  })

  type FormData = z.infer<typeof createTaskFormSchema>

  const { useCreateTask } = useHouseholdTaskQueries()
  const { mutate: createTask, isPending } = useCreateTask()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none')
  const [selectedWeekDays, setSelectedWeekDays] = useState<WeekDay[]>([])

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: '',
      description: null,
      startDate: new Date(),
      recurrenceRule: 'none',
    },
  })

  const selectedDate = watch('startDate')

  const handleDateChange = (
    event: DateTimePickerEvent,
    date: Date | undefined,
  ) => {
    setShowDatePicker(false)
    if (event.type === 'set' && date) {
      setValue('startDate', date, { shouldValidate: true })
    }
  }

  const handleRecurrenceChange = (value: string) => {
    const type = value as RecurrenceType
    setRecurrenceType(type)

    // Mapeia o tipo de recorrência para a regra RRULE usando a função compartilhada
    const rule = getRecurrenceRule(type, selectedWeekDays)
    setValue('recurrenceRule', rule)
  }

  const handleWeekDaysChange = (days: WeekDay[]) => {
    setSelectedWeekDays(days)
    const rule = getRecurrenceRule('custom', days)
    setValue('recurrenceRule', rule)
  }

  const handleCreateTask = (data: FormData) => {
    // Converte 'none' para null antes de enviar
    const payload = {
      ...data,
      recurrenceRule:
        data.recurrenceRule === 'none' ? null : data.recurrenceRule,
    }

    createTask(payload, {
      onSuccess: () => {
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title={t('taskCreate.createSuccess')}
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
              title={t('taskCreate.createError')}
              description={description}
              action="error"
              onClose={() => toast.close(id)}
            />
          ),
        })
      },
    })
  }

  return (
    <VStack flex={1} bg={colors.background}>
      <ScreenHeader title={t('taskCreate.title')} hasGoBackButton />

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={200}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <VStack flex={1} px="$6" mt="$6">
          {/* Título */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText color={colors.text}>
                {t('taskCreate.titleLabel')}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder={t('taskCreate.titlePlaceholder')}
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
                    {t('taskCreate.descriptionLabel')}
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
                    placeholder={t('taskCreate.descriptionPlaceholder')}
                    placeholderTextColor={colors.textInactive}
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
            name="startDate"
            render={() => (
              <FormControl isInvalid={!!errors.startDate} mt="$4">
                <FormControlLabel>
                  <FormControlLabelText color={colors.text}>
                    {t('taskCreate.startDateLabel')}
                  </FormControlLabelText>
                </FormControlLabel>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  bg={colors.card}
                  borderWidth={1}
                  borderColor={errors.startDate ? '$error500' : colors.border}
                  borderRadius="$md"
                  h={50}
                  px="$4"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection="row"
                >
                  <Text color={colors.text}>
                    {selectedDate.toLocaleDateString(currentLanguage, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                  <CalendarDays size={20} color={colors.text} />
                </Pressable>
                {errors.startDate && (
                  <FormControlError>
                    <FormControlErrorIcon
                      as={() => <AlertTriangle size={16} color="$error500" />}
                    />
                    <FormControlErrorText>
                      {errors.startDate.message}
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
              display="spinner" // Ou "default"
              onChange={handleDateChange}
            />
          )}

          {/* Recorrência */}
          <Select
            label={t('taskCreate.recurrenceLabel')}
            items={getRecurrenceOptions()}
            placeholder={t('taskCreate.recurrencePlaceholder')}
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
                  {t('taskCreate.weekDaysLabel')}
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
              title={t('taskCreate.saveButton')}
              onPress={handleSubmit(handleCreateTask)}
              isLoading={isPending}
            />
          </Box>
        </VStack>
      </KeyboardAwareScrollView>
    </VStack>
  )
}
