import { useState } from 'react'
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
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ScreenHeader } from '@components/ScreenHeader'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
// import { Select } from '@components/Select' // Usando seu componente de Select
import { ToastMessage } from '@components/ToastMessage'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, CalendarDays } from 'lucide-react-native'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'

// Esquema de validação Zod
const createTaskFormSchema = z.object({
  title: z
    .string({ required_error: 'O título é obrigatório.' })
    .min(1, 'O título é obrigatório.'),
  description: z.string().nullable().optional(),
  start_date: z.date({ required_error: 'A data de início é obrigatória.' }),
  recurrence_rule: z.string().nullable().optional(),
})

type FormData = z.infer<typeof createTaskFormSchema>

// Opções de Recorrência
const recurrenceOptions = [
  { label: 'Não se repete', value: null },
  { label: 'Diariamente', value: 'FREQ=DAILY' },
  // Adicionar opção de escolher dias da semana no futuro
  { label: 'Semanalmente', value: 'FREQ=WEEKLY' },
  { label: 'Quinzenalmente', value: 'FREQ=FORTNIGHTLY' },
  { label: 'Mensalmente', value: 'FREQ=MONTHLY' },
]

export function TaskCreate() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const toast = useToast()

  const { useCreateTask } = useHouseholdTaskQueries()
  const { mutate: createTask, isPending } = useCreateTask()

  const [showDatePicker, setShowDatePicker] = useState(false)

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
      start_date: new Date(),
      recurrence_rule: null,
    },
  })

  const selectedDate = watch('start_date')

  const handleDateChange = (
    event: DateTimePickerEvent,
    date: Date | undefined,
  ) => {
    setShowDatePicker(false)
    if (event.type === 'set' && date) {
      setValue('start_date', date, { shouldValidate: true })
    }
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
                // label="Título da Tarefa"
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
              display="spinner" // Ou "default"
              onChange={handleDateChange}
            />
          )}

          {/* Recorrência */}
          <Controller
            control={control}
            name="recurrence_rule"
            render={({ field: { onChange, value } }) => (
              <Select
                // label="Repetir"
                // items={recurrenceOptions}
                placeholder="Repetição"
                options={recurrenceOptions}
                selectedValue={value}
                onValueChange={onChange}
                // errorMessage={errors.recurrence_rule?.message}
                mt="$4"
              />
            )}
          />

          {/* Botão Salvar */}
          <Box mt="$8">
            <Button
              title="Salvar Tarefa"
              onPress={handleSubmit(handleCreateTask)}
              isLoading={isPending}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
