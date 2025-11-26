import { useAuthStore } from '@/src/stores/useAuthStore';
import { useRouter } from 'expo-router';
import { HeartHandshake, LogOut, Settings, Shield, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    api.get('/auth/me')
      .then(response => setUser(response.data))
      .catch(() => Alert.alert("Erro", "Não foi possível carregar o perfil."));
  }, []);

  function handleLogout() {
    Alert.alert("Sair", "Deseja realmente sair do aplicativo?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive",
        onPress: () => {
          logout();
          router.replace('/');
        }
      }
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* header */}
        <View className="bg-white pb-8 pt-4 px-6 rounded-b-[32px] shadow-sm items-center border-b border-gray-100">
          <View className="w-24 h-24 bg-primaryLight rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
            <User size={40} color="#6366F1" />
          </View>
          <Text className="font-bold text-2xl text-text mb-1">
            {user?.name || 'Carregando...'}
          </Text>
          <Text className="font-regular text-textLight">
            {user?.email || '...'}
          </Text>
        </View>

        {/* opcoes */}
        <View className="p-6 space-y-4">
          <Text className="font-bold text-lg text-text mb-2">Configurações</Text>
          
          <MenuOption icon={Settings} label="Preferências do App" />
          <MenuOption icon={Shield} label="Privacidade e Segurança" />
          <MenuOption icon={HeartHandshake} label="Central de Ajuda" />

          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 mt-8 active:bg-red-50"
            onPress={handleLogout}
          >
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text className="font-semibold text-red-500 text-base flex-1">
              Sair da conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuOption({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 active:bg-gray-50">
      <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
        <Icon size={20} color="#64748B" />
      </View>
      <Text className="font-medium text-text text-base flex-1">
        {label}
      </Text>
    </TouchableOpacity>
  );
}