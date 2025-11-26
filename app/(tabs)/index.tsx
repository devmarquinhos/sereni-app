import { AlertCircle, ChevronRight, Heart, Wind } from 'lucide-react-native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const userName = "Marcos"; // trocar dps para consumo pela api

  const moodOptions = [
    { level: 1, emoji: '😡', color: 'bg-red-100' },
    { level: 2, emoji: '😕', color: 'bg-orange-100' },
    { level: 3, emoji: '😐', color: 'bg-yellow-100' },
    { level: 4, emoji: '🙂', color: 'bg-lime-100' },
    { level: 5, emoji: '🥰', color: 'bg-green-100' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* parte de cima */}
        <View className="mb-8 mt-2">
          <Text className="font-bold text-3xl text-text mb-1">
            Olá, {userName} 👋
          </Text>
          <Text className="font-regular text-lg text-textLight">
            Vamos cuidar de você hoje.
          </Text>
        </View>

        {/* card do registro diario */}
        <View className="bg-surface p-6 rounded-3xl shadow-sm mb-8 border border-gray-100">
          <Text className="font-semibold text-lg text-text mb-4">
            Como você se sente agora?
          </Text>
          <View className="flex-row justify-between">
            {moodOptions.map((option) => (
              <TouchableOpacity 
                key={option.level}
                className={`w-12 h-12 ${option.color} rounded-full items-center justify-center active:scale-90 transition-transform`}
              >
                <Text className="text-2xl">{option.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* parte da pratica diaria */}
        <Text className="font-semibold text-xl text-text mb-4">
          Sua Prática Diária
        </Text>
        
        <TouchableOpacity className="bg-primaryLight p-5 rounded-3xl flex-row items-center mb-6 border border-indigo-100">
          <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mr-4">
            <Wind size={24} color="#6366F1" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg text-primary mb-1">
              Respiração Consciente
            </Text>
            <Text className="font-regular text-sm text-indigo-400">
              3 min • Iniciante
            </Text>
          </View>
          <View className="bg-primary w-8 h-8 rounded-full items-center justify-center">
             <ChevronRight size={20} color="white" />
          </View>
        </TouchableOpacity>

        {/* info para rede de apoio */}
        <Text className="font-semibold text-xl text-text mb-4">
          Para quem você ama
        </Text>

        <TouchableOpacity className="bg-secondaryLight p-5 rounded-3xl flex-row items-center mb-24 border border-teal-100">
          <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mr-4">
            <Heart size={24} color="#14B8A6" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg text-secondary mb-1">
              Como ajudar na crise
            </Text>
            <Text className="font-regular text-sm text-teal-600">
              Guia Prático • Leitura Rápida
            </Text>
          </View>
           <View className="bg-secondary w-8 h-8 rounded-full items-center justify-center">
             <ChevronRight size={20} color="white" />
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* botão sos */}
      <View className="absolute bottom-6 w-full px-6">
        <TouchableOpacity className="bg-sos py-4 rounded-2xl flex-row items-center justify-center shadow-lg active:opacity-90">
          <AlertCircle color="white" size={24} className="mr-2" />
          <Text className="font-bold text-white text-lg ml-2">
            Preciso de Ajuda (SOS)
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
