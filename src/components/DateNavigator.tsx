import { HStack, Pressable, Text } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@hooks/useLanguage'

type Props = {
  selectedDate: Date
  onChangeDate: (newDate: Date) => void
}

export function DateNavigator({ selectedDate, onChangeDate }: Props) {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()

  const handleDateChange = (daysToAdd: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + daysToAdd)
    onChangeDate(newDate)
  }

  const isToday = () => {
    const today = new Date()
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }

  const formattedDate = isToday()
    ? t('components.calendarView.today')
    : selectedDate.toLocaleDateString(currentLanguage, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

  return (
    <HStack
      w="100%"
      alignItems="center"
      justifyContent="space-between"
      p="$4"
      bg={colors.background}
    >
      <Pressable
        onPress={() => handleDateChange(-1)}
        hitSlop={10}
        p="$2"
        borderRadius="$full"
        $active-bg={colors.card}
      >
        <Feather name="chevron-left" size={24} color={colors.text} />
      </Pressable>

      <Pressable onPress={() => onChangeDate(new Date())}>
        <Text
          color={colors.text}
          fontFamily="$heading"
          fontSize="$lg"
          opacity={isToday() ? 1 : 0.7}
        >
          {formattedDate}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handleDateChange(1)}
        hitSlop={10}
        p="$2"
        borderRadius="$full"
        $active-bg={colors.card}
      >
        <Feather name="chevron-right" size={24} color={colors.text} />
      </Pressable>
    </HStack>
  )
}
