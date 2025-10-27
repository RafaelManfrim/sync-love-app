import { useState, useEffect } from 'react'
import { HStack, Pressable, Text, VStack } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'

export type WeekDay = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA'

interface WeekDaySelectorProps {
  selectedDays?: WeekDay[]
  onDaysChange: (days: WeekDay[]) => void
  disabled?: boolean
}

const weekDays: { label: string; value: WeekDay }[] = [
  { label: 'D', value: 'SU' },
  { label: 'S', value: 'MO' },
  { label: 'T', value: 'TU' },
  { label: 'Q', value: 'WE' },
  { label: 'Q', value: 'TH' },
  { label: 'S', value: 'FR' },
  { label: 'S', value: 'SA' },
]

export function WeekDaySelector({
  selectedDays = [],
  onDaysChange,
  disabled = false,
}: WeekDaySelectorProps) {
  const { colors } = useTheme()
  const [selected, setSelected] = useState<WeekDay[]>(selectedDays)

  useEffect(() => {
    setSelected(selectedDays)
  }, [selectedDays])

  const toggleDay = (day: WeekDay) => {
    if (disabled) return

    const newSelected = selected.includes(day)
      ? selected.filter((d) => d !== day)
      : [...selected, day]

    setSelected(newSelected)
    onDaysChange(newSelected)
  }

  return (
    <VStack w="100%">
      <HStack justifyContent="space-between" w="100%">
        {weekDays.map((day) => {
          const isSelected = selected.includes(day.value)

          return (
            <Pressable
              key={day.value}
              onPress={() => toggleDay(day.value)}
              disabled={disabled}
              w={40}
              h={40}
              borderRadius="$full"
              bg={isSelected ? colors.primary500 : colors.card}
              borderWidth={1}
              borderColor={isSelected ? colors.primary500 : colors.border}
              justifyContent="center"
              alignItems="center"
              opacity={disabled ? 0.5 : 1}
            >
              <Text
                color={isSelected ? '$white' : colors.text}
                fontWeight={isSelected ? '$bold' : '$normal'}
                fontSize="$sm"
              >
                {day.label}
              </Text>
            </Pressable>
          )
        })}
      </HStack>
    </VStack>
  )
}
