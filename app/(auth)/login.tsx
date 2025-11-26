import { useAuthStore } from '@/src/stores/useAuthStore';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      const { access_token } = response.data;

      setToken(access_token);

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      console.log("Token recebido:", access_token);

      router.replace('/(tabs)'); 
    } catch (error) {
      Alert.alert('Erro', 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6 w-10 h-10 justify-center">
        <ArrowLeft color="#1E293B" size={24} />
      </TouchableOpacity>

      <Text className="font-bold text-3xl text-text mb-2">Bem-vindo de volta</Text>
      <Text className="font-regular text-base text-textLight mb-8">
        Faça login para acessar seu diário e lições.
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="font-semibold text-text mb-2 ml-1">E-mail</Text>
          <TextInput 
            className="bg-white border border-gray-200 p-4 rounded-xl font-regular text-text focus:border-primary"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="font-semibold text-text mb-2 ml-1">Senha</Text>
          <TextInput 
            className="bg-white border border-gray-200 p-4 rounded-xl font-regular text-text focus:border-primary"
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity>
          <Text className="text-primary font-semibold text-right mt-2">Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        className={`bg-primary p-4 rounded-2xl mt-8 ${loading ? 'opacity-70' : ''}`}
        onPress={handleLogin}
        disabled={loading}
      >
         {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-bold text-white text-center text-lg">Entrar</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}