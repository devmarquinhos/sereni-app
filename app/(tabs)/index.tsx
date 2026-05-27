import { useRouter } from "expo-router";
import { AlertCircle, ChevronRight, Heart, Wind, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/services/api";

export default function HomeScreen() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newMood, setNewMood] = useState<number | null>(null);
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function handleSave() {
    if (!newText.trim()) {
      Alert.alert("Opa!", "Escreva pelo menos uma frase sobre seu dia.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/journal", {
        mood_rating: newMood,
        entry_text: newText,
      });

      setNewText("");
      setNewMood(null);
      setModalVisible(false);

      Alert.alert("Sucesso!", "Seu registro foi salvo no diário.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  const moodOptions = [
    { level: 1, emoji: "😡", color: "bg-red-100" },
    { level: 2, emoji: "😕", color: "bg-orange-100" },
    { level: 3, emoji: "😐", color: "bg-yellow-100" },
    { level: 4, emoji: "🙂", color: "bg-lime-100" },
    { level: 5, emoji: "🥰", color: "bg-green-100" },
  ];

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Token expirou ou inválido
          router.replace("/(auth)/login");
        }
        console.log("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* header */}
        <View className="mb-8 mt-2">
          {loading ? (
            <View className="flex-row items-center">
              <Text className="font-bold text-3xl text-text mr-2">Olá,</Text>
              <ActivityIndicator color="#6366F1" />
            </View>
          ) : (
            <Text className="font-bold text-3xl text-text mb-1">
              Olá, {user?.name?.split(" ")[0] || "Visitante"} 👋
            </Text>
          )}
          <Text className="font-regular text-lg text-textLight">
            Vamos cuidar de você hoje.
          </Text>
        </View>

        {/* card dos sentimento diário */}
        <View className="bg-surface p-6 rounded-3xl shadow-sm mb-8 border border-gray-100">
          <Text className="font-semibold text-lg text-text mb-4">
            Como você se sente agora?
          </Text>
          <View className="flex-row justify-between">
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.level}
                className={`w-12 h-12 ${option.color} rounded-full items-center justify-center active:scale-90 transition-transform`}
                onPress={() => {
                  setNewMood(option.level);
                  setModalVisible(true);
                }}
              >
                <Text className="text-2xl">{option.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* prática */}
        <Text className="font-semibold text-xl text-text mb-4">
          Sua Prática Diária
        </Text>

        <TouchableOpacity
          className="bg-primaryLight p-5 rounded-3xl flex-row items-center mb-6 border border-indigo-100"
          onPress={() => router.push("/breathing")}
        >
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

        {/* rede de apoio */}
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

      {/* sos */}
      <View className="absolute bottom-6 w-full px-6">
        <TouchableOpacity className="bg-sos py-4 rounded-2xl flex-row items-center justify-center shadow-lg active:opacity-90">
          <AlertCircle color="white" size={24} className="mr-2" />
          <Text className="font-bold text-white text-lg ml-2">
            Preciso de Ajuda (SOS)
          </Text>
        </TouchableOpacity>
      </View>

      {/* modal de nota diária, vinculada nos emojis */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end bg-black/60"
        >
          <View className="bg-white rounded-t-3xl p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">
                Como você está? ✨
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Humor
            </Text>
            <View className="flex-row justify-between mb-8">
              {moodOptions.map((option) => (
                <TouchableOpacity
                  key={option.level}
                  onPress={() => setNewMood(option.level)}
                  className={`w-14 h-14 rounded-2xl items-center justify-center border-2 ${
                    newMood === option.level
                      ? option.color
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <Text className="text-2xl">{option.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Notas
            </Text>
            <TextInput
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-base text-slate-800 flex-1 mb-6"
              multiline
              textAlignVertical="top"
              placeholder="Escreva sobre o que aconteceu hoje..."
              value={newText}
              onChangeText={setNewText}
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className={`w-full py-4 rounded-xl items-center mb-4 ${saving ? "bg-indigo-400" : "bg-indigo-600"}`}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Salvar Diário
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
