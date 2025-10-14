import { HStack, Heading, Text, VStack, Icon } from '@gluestack-ui/themed'
import { differenceInDays, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Gift, Heart } from 'lucide-react-native'

type Props = {
  title: string
  date: string // Formato 'YYYY-MM-DD'
  type: 'anniversary' | 'birthday' | 'event'
}

export function DateCard({ title, date, type }: Props) {
  const eventDate = parseISO(date)
  const today = new Date()

  // Garante que o ano do evento seja o atual ou o próximo
  if (eventDate < today) {
    eventDate.setFullYear(today.getFullYear())
    if (eventDate < today) {
      eventDate.setFullYear(today.getFullYear() + 1)
    }
  }

  const daysRemaining = differenceInDays(eventDate, today)

  const formattedDate = format(eventDate, "dd 'de' MMMM", {
    locale: ptBR,
  })

  const getIcon = () => {
    switch (type) {
      case 'anniversary':
        return <Icon as={Heart} color="$red500" size="lg" />
      case 'birthday':
        return <Icon as={Gift} color="$green500" size="lg" />
      default:
        return <Icon as={Calendar} color="$gray300" size="lg" />
    }
  }

  const getDaysText = () => {
    if (daysRemaining === 0) return 'É hoje!'
    if (daysRemaining === 1) return 'Falta 1 dia'
    return `Faltam ${daysRemaining} dias`
  }

  return (
    <HStack
      bg="$trueGray200"
      p="$4"
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
      mb="$3"
    >
      <HStack alignItems="center" space="md">
        {getIcon()}
        <VStack>
          <Heading color="$trueGray600" fontSize="$md" fontFamily="$heading">
            {title}
          </Heading>
          <Text color="$trueGray400" fontSize="$sm">
            {formattedDate}
          </Text>
        </VStack>
      </HStack>

      <VStack
        alignItems="center"
        justifyContent="center"
        bg="$trueGray400"
        p="$2"
        px="$3"
        rounded="$full"
      >
        <Text color="$white" fontSize="$xs" fontWeight="$bold">
          {getDaysText()}
        </Text>
      </VStack>
    </HStack>
  )
}
