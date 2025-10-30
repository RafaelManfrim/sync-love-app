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
  recurrenceOptions,
  getRecurrenceRule,
} from '@utils/recurrenceTypes'

// Esquema de validação Zod
const createTaskFormSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório.' })
    .min(1, 'O título é obrigatório.'),
  description: z.string().nullable().optional(),
  startDate: z.date({ required_error: 'A data de início é obrigatória.' }),
  recurrenceRule: z.string().nullable().optional(),
})

type FormData = z.infer<typeof createTaskFormSchema>

export function TaskCreate() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const toast = useToast()

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
    createTask(data, {
      onSuccess: () => {
        toast.show({
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Tarefa criada com sucesso!"
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
              title="Erro ao criar tarefa"
              description={error.message}
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
      <ScreenHeader title="Criar Nova Tarefa" hasGoBackButton />

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
                Título da Tarefa
              </FormControlLabelText>
            </FormControlLabel>
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
          </FormControl>

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
                    Data de Início (ou Vencimento)
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
                    {selectedDate.toLocaleDateString('pt-BR')}
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
            label="Repetir"
            items={recurrenceOptions}
            placeholder="Escolha a repetição"
            selectedValue={recurrenceType}
            value={
              recurrenceOptions.find((opt) => opt.value === recurrenceType)
                ?.label || 'Não se repete'
            }
            onValueChange={handleRecurrenceChange}
            mt="$4"
          />

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
              title="Salvar Tarefa"
              onPress={handleSubmit(handleCreateTask)}
              isLoading={isPending}
            />
          </Box>
        </VStack>
      </KeyboardAwareScrollView>
    </VStack>
  )
}
