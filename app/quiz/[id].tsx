import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/services/api"; // Importe sua api configurada

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Busca na rota que criamos no Passo 1
    api
      .get(`/content/lessons/${id}`)
      .then((response) => {
        // Filtra só o que é quiz
        const quizSteps = response.data.lesson_steps.filter(
          (s: any) => s.step_type === "MULTIPLE_CHOICE",
        );
        setSteps(quizSteps);
      })
      .catch((err) => console.error("Erro ao buscar quiz:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#6366F1" />;

  if (steps.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Nenhuma pergunta encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "blue", marginTop: 20 }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );

  const step = steps[currentStepIndex];
  const content = step.content; // O JSON do banco

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
          {content.question}
        </Text>

        {content.options.map((option: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={{
              padding: 16,
              backgroundColor: "white",
              borderRadius: 12,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
            onPress={() => {
              // Lógica simples para testar
              if (index === content.correctIndex) alert("Acertou!");
              else alert("Errou!");
            }}
          >
            <Text style={{ fontSize: 16 }}>{option}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => {
            if (currentStepIndex < steps.length - 1)
              setCurrentStepIndex((prev) => prev + 1);
            else alert("Fim do Quiz!");
          }}
          style={{
            marginTop: 20,
            backgroundColor: "#6366F1",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Próxima</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
