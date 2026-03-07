import { Plus, Smile, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

// interface do registro
type JournalEntry = {
  id: string;
  mood_rating: number;
  entry_text: string | null;
  created_at: string;
};

export default function JournalScreen() {
  // states
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // states do modal de criação
  const [isModalVisible, setModalVisible] = useState(false);
  const [newMood, setNewMood] = useState(3);
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);

  // states do modal de leitura
  const [isReadModalVisible, setReadModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // fetch da api
  async function fetchEntries() {
    try {
      const response = await api.get("/journal");
      setEntries(response.data);
    } catch (error) {
      console.log("Erro ao buscar diário", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  // salva um novo registro
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

      // limpa a caixa de texto e fecha o modal
      setNewText("");
      setNewMood(3);
      setModalVisible(false);

      // atualiza a lista de registros
      fetchEntries();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
      console.log(error);
    } finally {
      setSaving(false);
    }
  }

  // opt de humor
  const moodOptions = [
    { level: 1, emoji: "😡", color: "bg-red-100 border-red-300" },
    { level: 2, emoji: "😕", color: "bg-orange-100 border-orange-300" },
    { level: 3, emoji: "😐", color: "bg-yellow-100 border-yellow-300" },
    { level: 4, emoji: "🙂", color: "bg-blue-100 border-blue-300" },
    { level: 5, emoji: "🥰", color: "bg-green-100 border-green-300" },
  ];

  // render da lista de registros
  const renderItem = ({ item }: { item: JournalEntry }) => {
    const isLongText = item.entry_text && item.entry_text.length > 80;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (item.entry_text) {
            setSelectedEntry(item);
            setReadModalVisible(true);
          }
        }}
        className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm"
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                item.mood_rating >= 4
                  ? "bg-green-100"
                  : item.mood_rating === 3
                    ? "bg-yellow-100"
                    : "bg-red-100"
              }`}
            >
              <Text>
                {item.mood_rating === 5
                  ? "🥰"
                  : item.mood_rating === 4
                    ? "🙂"
                    : item.mood_rating === 3
                      ? "😐"
                      : item.mood_rating === 2
                        ? "😕"
                        : "😡"}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs font-medium">
              {formatDateSimple(item.created_at)}
            </Text>
          </View>
        </View>
        {item.entry_text && (
          <View>
            <Text
              className="text-gray-700 text-base leading-6"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item.entry_text}
            </Text>

            {isLongText && (
              <Text className="text-indigo-500 font-semibold text-sm mt-2">
                Ler nota completa...
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // formata a data para a exibicao simples
  function formatDateSimple(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);

    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const hora = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");

    return `${dia}/${mes} às ${hora}:${min}`;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* cabeçalho */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-slate-800">Seu Diário 📖</Text>
        <Text className="text-slate-500">Acompanhe sua jornada emocional.</Text>
      </View>

      {/* lista de registros */}
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" className="mt-10" />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 opacity-50">
              <Smile size={60} color="#CBD5E1" />
              <Text className="text-slate-400 mt-4 text-center">
                Nada aqui ainda.{"\n"}Que tal registrar seu dia?
              </Text>
            </View>
          }
        />
      )}

      {/* fab */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-indigo-500/30"
      >
        <Plus color="white" size={24} />
      </TouchableOpacity>

      {/* modal de nova nota diária */}
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

      {/* modal de leitura */}
      <Modal
        visible={isReadModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReadModalVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/60 p-6">
          <View className="bg-white rounded-3xl p-6 max-h-[80%] shadow-lg">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">
                Seu Dia 📖
              </Text>
              <TouchableOpacity
                onPress={() => setReadModalVisible(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* conteúdo da nota */}
            {selectedEntry && (
              <>
                <View className="flex-row items-center mb-6 pb-4 border-b border-gray-100">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                      selectedEntry.mood_rating >= 4
                        ? "bg-green-100"
                        : selectedEntry.mood_rating === 3
                          ? "bg-yellow-100"
                          : "bg-red-100"
                    }`}
                  >
                    <Text className="text-2xl">
                      {moodOptions.find(
                        (m) => m.level === selectedEntry.mood_rating,
                      )?.emoji || "😐"}
                    </Text>
                  </View>
                  <Text className="text-slate-500 font-medium">
                    {formatDateSimple(selectedEntry.created_at)}
                  </Text>
                </View>

                {/* texto rolável */}
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text className="text-slate-700 text-base leading-7">
                    {selectedEntry.entry_text}
                  </Text>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
