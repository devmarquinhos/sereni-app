import { useRouter } from 'expo-router';
import { HeartHandshake, LogOut, Settings, Shield, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user: storedUser } = useAuthStore();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(response => setUser(response.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    Alert.alert("Sair", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
          console.log("Usuário deslogado");
        }
      }
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* header */}
        <View className="mb-8 mt-2">
          <Text className="font-bold text-3xl text-text mb-1">Seu Perfil</Text>
          <Text className="font-regular text-lg text-textLight">Gerencie sua conta e preferências.</Text>
        </View>

        {/* user data */}
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-row items-center mb-8">
          <View className="w-16 h-16 bg-primaryLight rounded-full items-center justify-center mr-4">
            <User size={32} color="#6366F1" />
          </View>
          <View>
            {loading ? (
               <ActivityIndicator size="small" color="#6366F1" />
            ) : (
              <>
                <Text className="font-bold text-xl text-text">
                  {user?.name || 'Usuário'}
                </Text>
                <Text className="font-regular text-textLight">
                  {user?.email || 'email@exemplo.com'}
                </Text>
              </>
            )}
          </View>
        </View>

        <View className="space-y-4">
          <Text className="font-bold text-lg text-text mb-2">Configurações</Text>
          
          <MenuOption icon={Settings} label="Preferências do App" />
          <MenuOption icon={Shield} label="Privacidade e Segurança" />
          <MenuOption icon={HeartHandshake} label="Central de Ajuda" />

          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 mt-8 active:bg-red-50 mb-10"
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