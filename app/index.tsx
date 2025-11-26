import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShieldCheck } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background justify-between p-6">
      <StatusBar style="dark" />

      {/* logo ou imagem principal */}
      <View className="items-center mt-10">
        {/* trocar para uma logo dps */}
        <View className="w-32 h-32 bg-primaryLight rounded-full items-center justify-center mb-6">
           <Text className="text-4xl">🧘</Text>
        </View>
        
        <Text className="font-bold text-3xl text-text text-center mb-2">
          Bem-vindo ao Sereni
        </Text>
        <Text className="font-regular text-lg text-textLight text-center px-4">
          Seu espaço seguro para cultivar a calma e o equilíbrio no dia a dia.
        </Text>
      </View>

      {/* aviso e botões */}
      <View className="w-full mb-6">
        {/* card do aviso */}
        <View className="bg-blue-50 p-4 rounded-xl flex-row items-start mb-8 border border-blue-100">
          <ShieldCheck size={20} color="#6366F1" style={{ marginTop: 2 }} />
          <Text className="font-regular text-xs text-slate-600 ml-3 flex-1 leading-5">
            Importante: Este aplicativo é uma ferramenta de apoio e <Text className="font-bold">não substitui</Text> o tratamento psicológico ou médico profissional. Em caso de emergência, busque ajuda especializada.
          </Text>
        </View>

        {/* login e cadastro */}
        <TouchableOpacity 
          className="bg-primary w-full p-4 rounded-2xl mb-4 shadow-sm active:opacity-90"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="font-semibold text-white text-center text-lg">
            Criar minha conta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white border border-gray-200 w-full p-4 rounded-2xl active:bg-gray-50"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="font-semibold text-text text-center text-lg">
            Já tenho uma conta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}