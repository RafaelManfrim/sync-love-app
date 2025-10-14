import { MissionCard } from '@components/MissionCard'
import { ScoreCard } from '@components/ScoreCard'
import { ScreenHeader } from '@components/ScreenHeader'
import {
  Button,
  ButtonText,
  FlatList,
  Fab,
  FabIcon,
  AddIcon,
  VStack,
  HStack,
  Heading,
} from '@gluestack-ui/themed'
import { useState } from 'react'

// --- Mock Data (Dados de Exemplo) ---
const MOCK_USERS = {
  user1: { name: 'Você', avatarUrl: 'https://github.com/rafaelmanfrim.png' }, // Coloque uma URL de avatar real se quiser
  user2: {
    name: 'Ana Rita',
    avatarUrl: 'https://github.com/anaritagreen.png',
  },
}

const MOCK_MISSIONS = [
  {
    id: '1',
    title: 'Lavar a louça do jantar',
    points: 10,
    category: 'Casa',
    assignees: [MOCK_USERS.user1],
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Passear com o cachorro',
    points: 15,
    category: 'Pets',
    assignees: [MOCK_USERS.user2],
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Organizar as contas do mês',
    points: 50,
    category: 'Finanças',
    assignees: [MOCK_USERS.user1, MOCK_USERS.user2],
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Levar o lixo para fora',
    points: 5,
    category: 'Casa',
    assignees: [MOCK_USERS.user1],
    isCompleted: true,
  },
  {
    id: '5',
    title: 'Comprar presente da vovó',
    points: 25,
    category: 'Família',
    assignees: [MOCK_USERS.user2],
    isCompleted: false,
  },
]

export function Missions() {
  const [missions, setMissions] = useState(MOCK_MISSIONS)
  const [filter, setFilter] = useState<'all' | 'my' | 'partner' | 'our'>('all')

  const handleToggleMission = (missionId: string) => {
    setMissions((prevMissions) =>
      prevMissions.map((mission) =>
        mission.id === missionId
          ? { ...mission, isCompleted: !mission.isCompleted }
          : mission,
      ),
    )
  }

  const filteredMissions = missions
    .filter((mission) => {
      if (filter === 'my')
        return (
          mission.assignees.some((u) => u.name === MOCK_USERS.user1.name) &&
          !mission.isCompleted
        )
      if (filter === 'partner')
        return (
          mission.assignees.some((u) => u.name === MOCK_USERS.user2.name) &&
          !mission.isCompleted
        )
      if (filter === 'our')
        return mission.assignees.length > 1 && !mission.isCompleted
      return !mission.isCompleted // 'all' filter, show only pending
    })
    .concat(missions.filter((mission) => mission.isCompleted)) // always show completed at the end

  return (
    <VStack flex={1}>
      <ScreenHeader title="Tarefas" />
      <VStack p="$5" flex={1}>
        <ScoreCard
          currentPoints={250}
          goalPoints={500}
          reward="Jantar especial! 🍕"
          user1={{ ...MOCK_USERS.user1, score: 120 }}
          user2={{ ...MOCK_USERS.user2, score: 130 }}
        />

        <HStack space="sm" mb="$4">
          <Button
            size="xs"
            variant={filter === 'all' ? 'solid' : 'outline'}
            backgroundColor={filter === 'all' ? '$red500' : '$transparent'}
            borderColor="$red500"
            onPress={() => setFilter('all')}
          >
            <ButtonText color={filter === 'all' ? '$white' : '$red500'}>
              Todas
            </ButtonText>
          </Button>
          <Button
            size="xs"
            variant={filter === 'my' ? 'solid' : 'outline'}
            backgroundColor={filter === 'my' ? '$red500' : '$transparent'}
            borderColor="$red500"
            onPress={() => setFilter('my')}
          >
            <ButtonText color={filter === 'my' ? '$white' : '$red500'}>
              Minhas
            </ButtonText>
          </Button>
          <Button
            size="xs"
            variant={filter === 'partner' ? 'solid' : 'outline'}
            backgroundColor={filter === 'partner' ? '$red500' : '$transparent'}
            borderColor="$red500"
            onPress={() => setFilter('partner')}
          >
            <ButtonText color={filter === 'partner' ? '$white' : '$red500'}>
              Dela
            </ButtonText>
          </Button>
          <Button
            size="xs"
            variant={filter === 'our' ? 'solid' : 'outline'}
            backgroundColor={filter === 'our' ? '$red500' : '$transparent'}
            borderColor="$red500"
            onPress={() => setFilter('our')}
          >
            <ButtonText color={filter === 'our' ? '$white' : '$red500'}>
              Nossas
            </ButtonText>
          </Button>
        </HStack>

        <FlatList
          data={filteredMissions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MissionCard
              {...item}
              onToggle={() => handleToggleMission(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </VStack>
    </VStack>
  )
}
