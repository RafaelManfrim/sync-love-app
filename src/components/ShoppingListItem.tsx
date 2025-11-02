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
import { currencyFormatter } from '@utils/currencyFormatter'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@hooks/useLanguage'

interface ShoppingListItemProps {
  item: ShoppingItemDTO
  handleToggleItem: (itemId: number) => void
  isReadOnly?: boolean
}

export function ShoppingListItem({
  item,
  handleToggleItem,
  isReadOnly = false,
}: ShoppingListItemProps) {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { getCurrencyConfig } = useLanguage()

  const { locale, currency } = getCurrencyConfig()

  return (
    <HStack
      p="$3"
      mb="$3"
      borderBottomWidth={1}
      borderBottomColor={colors.border}
      alignItems="center"
    >
      <Checkbox
        size="md"
        isChecked={item.is_checked}
        onChange={() => handleToggleItem(item.id)}
        aria-label={t('components.shoppingListItem.checkboxLabel', {
          name: item.product.name,
        })}
        value={item.product.name}
        isDisabled={isReadOnly}
        mr="$3"
      >
        <CheckboxIndicator
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
        {/* (x{item.quantity}) */}
        {item.unit_price
          ? currencyFormatter(item.unit_price, locale, currency)
          : item.average_price && !isReadOnly
            ? currencyFormatter(item.average_price, locale, currency)
            : t('components.shoppingListItem.notAvailable')}
      </Text>
    </HStack>
  )
}
