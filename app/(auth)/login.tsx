import { useAuthStore } from "@/src/stores/useAuthStore";
import { useRouter } from "expo-router";
import { ArrowLeft, X, Mail, KeyRound, Lock } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/services/api";

export default function LoginScreen() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  
  // Estados de Login
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- ESTADOS DE RECUPERAÇÃO ---
  const [isForgotModalVisible, setForgotModalVisible] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'reset'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;
      setToken(access_token);
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      router.replace("/(tabs)");
    } catch (error: any) {
      const message = error.response?.data?.message || "Verifique suas credenciais.";
      Alert.alert("Erro ao entrar", message);
    } finally {
      setLoading(false);
    }
  }

  // Etapa 1: Solicitar Código
  async function handleRequestCode() {
    if (!recoveryEmail.includes("@")) return Alert.alert("Erro", "E-mail inválido.");
    try {
      setRecoveryLoading(true);
      await api.post("/auth/forgot-password", { email: recoveryEmail });
      Alert.alert("Código Enviado", "Verifique sua caixa de entrada.");
      setRecoveryStep('reset');
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível enviar o código.");
    } finally {
      setRecoveryLoading(false);
    }
  }

  // Etapa 2: Validar Código e Trocar Senha
  async function handleResetPassword() {
    if (recoveryCode.length !== 6) return Alert.alert("Erro", "O código deve ter 6 dígitos.");
    if (newPassword.length < 6) return Alert.alert("Erro", "A nova senha deve ter no mínimo 6 caracteres.");

    try {
      setRecoveryLoading(true);
      await api.post("/auth/reset-password", {
        email: recoveryEmail,
        code: recoveryCode,
        newPassword: newPassword,
      });
      Alert.alert("Sucesso", "Senha alterada! Agora você pode fazer login.");
      closeRecoveryModal();
    } catch (error: any) {
      Alert.alert("Erro", "Código inválido ou expirado.");
    } finally {
      setRecoveryLoading(false);
    }
  }

  function closeRecoveryModal() {
    setForgotModalVisible(false);
    setRecoveryStep('request');
    setRecoveryCode("");
    setNewPassword("");
    setRecoveryEmail("");
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6 w-10 h-10 justify-center">
        <ArrowLeft color="#1E293B" size={24} />
      </TouchableOpacity>

      <Text className="font-bold text-3xl text-text mb-2">Bem-vindo de volta</Text>
      <Text className="font-regular text-base text-textLight mb-8">Faça login para acessar seu diário e lições.</Text>

      <View className="space-y-4">
        <View>
          <Text className="font-semibold text-text mb-2 ml-1">E-mail</Text>
          <TextInput
            className="bg-white border border-gray-200 p-4 rounded-xl font-regular text-text"
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
            className="bg-white border border-gray-200 p-4 rounded-xl font-regular text-text"
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
          <Text className="text-primary font-semibold text-right mt-2">Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`bg-primary p-4 rounded-2xl mt-8 ${loading ? "opacity-70" : ""}`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text className="font-bold text-white text-center text-lg">Entrar</Text>}
      </TouchableOpacity>

      {/* --- MODAL DE RECUPERAÇÃO --- */}
      <Modal visible={isForgotModalVisible} transparent animationType="fade" onRequestClose={closeRecoveryModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-center bg-black/60 p-6">
          <View className="bg-white rounded-3xl p-6 shadow-xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-bold text-xl text-text">Recuperar Senha</Text>
              <TouchableOpacity onPress={closeRecoveryModal} className="p-2 bg-gray-100 rounded-full">
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {recoveryStep === 'request' ? (
              <View>
                <Text className="font-regular text-textLight mb-6">Insira seu e-mail para enviarmos um código de confirmação.</Text>
                <TextInput
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 font-regular"
                  placeholder="E-mail"
                  value={recoveryEmail}
                  onChangeText={setRecoveryEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity onPress={handleRequestCode} disabled={recoveryLoading} className="bg-primary p-4 rounded-2xl items-center">
                  {recoveryLoading ? <ActivityIndicator color="white" /> : <Text className="font-bold text-white text-lg">Enviar Código</Text>}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text className="font-regular text-textLight mb-4 text-center">Código enviado para:{"\n"}<Text className="font-bold text-primary">{recoveryEmail}</Text></Text>
                
                <TextInput
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-3 font-bold text-center text-2xl tracking-[10px]"
                  placeholder="000000"
                  maxLength={6}
                  keyboardType="number-pad"
                  value={recoveryCode}
                  onChangeText={setRecoveryCode}
                />

                <TextInput
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 font-regular text-text"
                  placeholder="Nova Senha"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />

                <TouchableOpacity onPress={handleResetPassword} disabled={recoveryLoading} className="bg-primary p-4 rounded-2xl items-center">
                  {recoveryLoading ? <ActivityIndicator color="white" /> : <Text className="font-bold text-white text-lg">Trocar Senha</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRecoveryStep('request')} className="mt-4">
                  <Text className="text-center text-textLight font-semibold">Usar outro e-mail</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
