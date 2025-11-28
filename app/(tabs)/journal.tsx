import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar, Frown, Meh, Plus, Smile } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

type JournalEntry = {
  id: string;
  mood_rating: number;
  entry_text?: string;
  created_at: string;
};

export default function JournalScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchJournal() {
    try {
      const response = await api.get('/journal');
      setEntries(response.data);
    } catch (error) {
      console.log('Erro ao buscar diário', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchJournal();
    }, [])
  );

  const getMoodIcon = (rating: number) => {
    if (rating <= 2) return <Frown size={24} color="#EF4444" />;
    if (rating === 3) return <Meh size={24} color="#EAB308" />;
    return <Smile size={24} color="#10B981" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const ListHeader = () => (
    <View className="mb-8 mt-2">
      <Text className="font-bold text-3xl text-text mb-1">Meus Registros</Text>
      <Text className="font-regular text-lg text-textLight">Acompanhe sua jornada emocional.</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 }}
          ListHeaderComponent={ListHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchJournal(); }} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center mt-10 opacity-50">
              <Calendar size={48} color="#64748B" />
              <Text className="font-semibold text-lg text-textLight mt-4">Nenhum registro ainda</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View className="flex-row mb-6 relative">
              {/* timeline */}
              {index !== entries.length - 1 && (
                <View className="absolute left-[19px] top-10 bottom-[-30] w-[2px] bg-gray-200 z-0" />
              )}
              
              {/* icon */}
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm z-10 mr-4">
                {getMoodIcon(item.mood_rating)}
              </View>

              {/* Card */}
              <View className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Text className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  {formatDate(item.created_at)}
                </Text>
                <Text className="font-regular text-text text-base leading-6">
                  {item.entry_text || "Sem anotações."}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95 transition-transform"
        onPress={() => router.push('/journal/new-entry')}
      >
        <Plus color="white" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}