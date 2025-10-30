import {
  Select as GluestackSelect,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectPortal,
  SelectTrigger,
  SelectBackdrop,
  SelectItem,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Spinner,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ChevronDownIcon } from 'lucide-react-native'

type SelectOption = {
  label: string
  value: string | number | null
}

interface SelectProps
  extends Omit<
    React.ComponentProps<typeof GluestackSelect>,
    'children' | 'mt'
  > {
  label?: string
  items: SelectOption[]
  placeholder?: string
  errorMessage?: string
  isLoading?: boolean
  value?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mt?: any
}

export function Select({
  label,
  items,
  placeholder = 'Selecione uma opção',
  errorMessage,
  isLoading = false,
  value,
  mt,
  ...rest
}: SelectProps) {
  const { colors } = useTheme()

  return (
    <FormControl isInvalid={!!errorMessage} mt={mt}>
      {label && (
        <FormControlLabel mb="$2">
          <FormControlLabelText color={colors.text}>
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}

      <GluestackSelect
        w="100%"
        h="$12"
        isDisabled={isLoading}
        $focus={{
          borderColor: colors.primary500,
        }}
        $invalid={{
          borderColor: '$error500',
        }}
        {...rest}
      >
        <SelectTrigger
          variant="outline"
          h="$12"
          w="$full"
          bg={colors.card}
          borderColor={errorMessage ? '$error500' : colors.border}
        >
          <SelectInput
            placeholder={placeholder}
            placeholderTextColor={colors.textInactive}
            color={colors.text}
            value={value}
          />
          {isLoading ? (
            <Spinner size="small" color={colors.primary500} mr="$3" />
          ) : (
            <SelectIcon
              as={ChevronDownIcon}
              mr="$3"
              color={colors.textInactive}
            />
          )}
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent pb="$16" bg={colors.card}>
            <SelectDragIndicatorWrapper py="$4">
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {items.map((item) => (
              <SelectItem
                key={item.value === null ? 'null' : String(item.value)}
                label={item.label}
                value={item.value === null ? 'null' : String(item.value)}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </GluestackSelect>

      {errorMessage && (
        <FormControlError>
          <FormControlErrorText color="$error500">
            {errorMessage}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  )
}
