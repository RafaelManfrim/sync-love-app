import { ShoppingItemDTO } from '@dtos/ShoppingItemDTO'
import {
  CheckboxIcon,
  CheckIcon,
  Text,
  Checkbox,
  CheckboxIndicator,
  HStack,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'

interface ShoppingListItemProps {
  item: ShoppingItemDTO
  handleToggleItem: (itemId: number) => void
}

export function ShoppingListItem({
  item,
  handleToggleItem,
}: ShoppingListItemProps) {
  const { colors } = useTheme()

  return (
    <HStack
      p="$3"
      mb="$3"
      borderBottomWidth={1}
      borderBottomColor={colors.border}
    >
      <Checkbox
        size="md"
        isChecked={item.is_checked}
        onChange={() => handleToggleItem(item.id)}
        aria-label={item.product.name}
        value={item.product.name}
      >
        <CheckboxIndicator
          mr="$3"
          $checked-bg={colors.primary500}
          $checked-borderColor={colors.primary600}
        >
          <CheckboxIcon as={CheckIcon} color={colors.textContrast} />
        </CheckboxIndicator>
      </Checkbox>
      <Text
        color={item.is_checked ? colors.textInactive : colors.text}
        flex={1}
        textDecorationLine={item.is_checked ? 'line-through' : 'none'}
      >
        {item.product.name}
      </Text>
      <Text
        color={item.is_checked ? colors.textInactive : colors.text}
        fontSize="$xs"
      >
        (x{item.quantity})
      </Text>
    </HStack>
  )
}
