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
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'

import { ChevronDownIcon } from 'lucide-react-native'

interface SelectProps extends React.ComponentProps<typeof GluestackSelect> {}

export function Select({ ...rest }: SelectProps) {
  const { colors } = useTheme()

  return (
    <GluestackSelect
      w="100%"
      h="$12"
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
        borderColor={colors.border}
      >
        <SelectInput
          placeholder="Gênero"
          placeholderTextColor={colors.textInactive}
          color={colors.text}
        />
        <SelectIcon as={ChevronDownIcon} mr="$3" color={colors.textInactive} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent pb="$16" bg={colors.card}>
          <SelectDragIndicatorWrapper py="$4">
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectItem label="Masculino" value="MALE" />
          <SelectItem label="Feminino" value="FEMALE" />
        </SelectContent>
      </SelectPortal>
    </GluestackSelect>
  )
}
