import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    if (password.length < 12) {
      return Alert.alert('Senha fraca', 'A senha precisa ter no mínimo 12 caracteres.');
    }

    try {
      setLoading(true);
      await api.post('/auth/register', { name, email, password });
      
      Alert.alert('Sucesso', 'Conta criada! Faça login para continuar.');
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a conta. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      {/* header */}
      <TouchableOpacity onPress={() => router.back()} className="mb-6 w-10 h-10 justify-center">
        <ArrowLeft color="#1E293B" size={24} />
      </TouchableOpacity>

      <Text className="font-bold text-3xl text-text mb-2">Criar Conta</Text>
      <Text className="font-regular text-base text-textLight mb-8">
        Comece sua jornada de autocuidado hoje.
      </Text>

      {/* form de cadastro */}
      <View className="space-y-4">
        <View>
          <Text className="font-semibold text-text mb-2 ml-1">Nome</Text>
          <TextInput 
            className="bg-white border border-gray-200 p-4 rounded-xl font-regular text-text focus:border-primary"
            placeholder="Como quer ser chamado?"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

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
            placeholder="Mínimo de 12 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text className="text-xs text-gray-400 mt-1 ml-1">
            Para sua segurança, use uma senha forte.
          </Text>
        </View>
      </View>

      {/* btn cadastrar */}
      <TouchableOpacity 
        className={`bg-primary p-4 rounded-2xl mt-8 ${loading ? 'opacity-70' : ''}`}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-bold text-white text-center text-lg">Cadastrar</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}