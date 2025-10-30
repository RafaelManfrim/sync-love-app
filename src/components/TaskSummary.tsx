import { useState, useMemo } from 'react'
import { HStack, VStack, Text, Pressable } from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { useAuth } from '@hooks/useAuth'
import { useHouseholdTaskQueries } from '@hooks/api/useHouseholdTaskQueries'
import { Loading } from './Loading'
import { ScoreCard } from './ScoreCard' // Reutilizando o componente de Missions
import { Feather } from '@expo/vector-icons'

// Função para capitalizar o mês
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function TaskSummary() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  const { useFetchTasksSummary } = useHouseholdTaskQueries()

  const { year, month } = useMemo(() => {
    return {
      year: selectedMonth.getFullYear(),
      month: selectedMonth.getMonth() + 1, // API espera mês 1-12
    }
  }, [selectedMonth])

  const { data: summary, isLoading } = useFetchTasksSummary(year, month)

  const handleMonthChange = (add: number) => {
    setSelectedMonth((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + add)
      return newDate
    })
  }

  const formattedMonth = useMemo(() => {
    const monthName = selectedMonth.toLocaleDateString('pt-BR', {
      month: 'long',
    })
    return `${capitalizeFirstLetter(monthName)} de ${selectedMonth.getFullYear()}`
  }, [selectedMonth])

  // Encontra os dados do usuário logado e do parceiro
  const me = summary?.members.find((m) => m.id === user.id)
  const partner = summary?.members.find((m) => m.id !== user.id)

  return (
    <VStack w="$full" bg={colors.background}>
      <HStack
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        mb="$3"
      >
        <Pressable
          onPress={() => handleMonthChange(-1)}
          hitSlop={10}
          p="$2"
          borderRadius="$full"
          $active-bg={colors.card}
        >
          <Feather name="chevron-left" size={24} color={colors.text} />
        </Pressable>

        <Text color={colors.text} fontFamily="$heading" fontSize="$lg">
          {formattedMonth}
        </Text>

        <Pressable
          onPress={() => handleMonthChange(1)}
          hitSlop={10}
          p="$2"
          borderRadius="$full"
          $active-bg={colors.card}
        >
          <Feather name="chevron-right" size={24} color={colors.text} />
        </Pressable>
      </HStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScoreCard
          currentPoints={summary?.totalCompleted || 0}
          goalPoints={summary?.totalPlanned || 0}
          me={{
            name: me?.name || 'Você',
            score: me?.completedCount || 0,
            avatarUrl: me?.avatar_url ?? undefined,
          }}
          partner={{
            name: partner?.name || 'Parceiro(a)',
            score: partner?.completedCount || 0,
            avatarUrl: partner?.avatar_url ?? undefined,
          }}
        />
      )}
    </VStack>
  )
}
