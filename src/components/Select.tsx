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

import { ChevronDownIcon } from 'lucide-react-native'

interface SelectProps extends React.ComponentProps<typeof GluestackSelect> {}

export function Select({ ...rest }: SelectProps) {
  return (
    <GluestackSelect
      w="100%"
      h="$12"
      $focus={{
        borderColor: '$red500',
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
        bg="$trueGray100"
        borderColor="$trueGray200"
      >
        <SelectInput placeholder="Gênero" />
        <SelectIcon as={ChevronDownIcon} mr="$3" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent pb="$16">
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
