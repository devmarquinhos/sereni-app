import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  RefreshCcw,
  XCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { api } from "../../src/services/api";

// circulo de progresso
const CircularProgress = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = total > 0 ? current / total : 0;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg height={size} width={size} style={{ position: "absolute" }}>
        <Circle
          stroke="#E2E8F0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#4F46E5"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="items-center justify-center">
        <Text className="text-lg font-bold text-indigo-900">{current}</Text>
      </View>
    </View>
  );
};

// interfaces para conteudo da lição
type StepContent = {
  question: string;
  options: string[];
  correctIndex: number;
};

type LessonStep = {
  id: number;
  step_type: string;
  content: StepContent;
};

export default function DynamicQuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { height } = Dimensions.get("window");
  const isSmallScreen = height < 700;

  const [steps, setSteps] = useState<LessonStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonTitle, setLessonTitle] = useState("Atividade");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const response = await api.get(`/content/lessons/${id}`);
        setLessonTitle(response.data.title);

        const quizSteps = response.data.lesson_steps.filter(
          (step: any) => step.step_type === "MULTIPLE_CHOICE",
        );
        setSteps(quizSteps);
      } catch (error) {
        console.error("Erro ao buscar lição:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchLesson();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-500 mt-4 font-medium">
          Preparando atividade...
        </Text>
      </View>
    );
  }

  if (steps.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 p-6">
        <Text className="text-slate-500 text-center text-lg">
          Nenhuma pergunta encontrada.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-4">
          <Text className="text-indigo-600 font-bold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentStep = steps[currentStepIndex];
  const currentProgressNumber = currentStepIndex + 1;

  function handleSelectOption(index: number) {
    if (isConfirmed) return;
    setSelectedOption(index);
  }

  function handleNext() {
    if (selectedOption === null) return;

    if (!isConfirmed) {
      setIsConfirmed(true);
      if (selectedOption === currentStep.content.correctIndex) {
        setScore((prev) => prev + 1);
      }
    } else {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsConfirmed(false);
      } else {
        setShowResult(true);
      }
    }
  }

  if (showResult) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <View className="items-center mb-8">
          <CheckCircle size={80} color="#4F46E5" />
          <Text className="text-3xl font-bold text-slate-800 mt-6 text-center">
            Atividade Concluída!
          </Text>
          <Text className="text-lg text-slate-500 text-center mt-2">
            Você acertou{" "}
            <Text className="font-bold text-indigo-600">{score}</Text> de{" "}
            {steps.length}.
          </Text>
        </View>

        <TouchableOpacity
          className="w-full bg-indigo-600 p-4 rounded-2xl items-center mb-4"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold text-lg">
            Voltar para Explorar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-center p-4"
          onPress={() => {
            setScore(0);
            setCurrentStepIndex(0);
            setSelectedOption(null);
            setIsConfirmed(false);
            setShowResult(false);
          }}
        >
          <RefreshCcw size={20} color="#64748B" />
          <Text className="text-slate-500 font-medium ml-2">
            Fazer novamente
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      {/* Header Compacto */}
      <View className="px-4 py-2 flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* container principal */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* titulo */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
          {lessonTitle}
        </Text>

        {/* pergunta +  progressão */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mr-3">
            <Text
              className={`${isSmallScreen ? "text-lg" : "text-xl"} font-bold text-slate-800 leading-7`}
            >
              {currentStep.content.question}
            </Text>
          </View>
          <View>
            <CircularProgress
              current={currentProgressNumber}
              total={steps.length}
            />
          </View>
        </View>

        {/* alternativas */}
        <View className="space-y-3 mb-8">
          {currentStep.content.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentStep.content.correctIndex;

            let borderColor = "border-slate-200";
            let bgColor = "bg-white";
            let textColor = "text-slate-600";
            let IconIndicator = (
              <View className="w-5 h-5 rounded-full border-2 border-slate-300" />
            );

            if (isConfirmed) {
              if (isCorrect) {
                borderColor = "border-green-500";
                bgColor = "bg-green-50";
                textColor = "text-green-700";
                IconIndicator = <CheckCircle size={20} color="#15803d" />;
              } else if (isSelected && !isCorrect) {
                borderColor = "border-red-400";
                bgColor = "bg-red-50";
                textColor = "text-red-700";
                IconIndicator = <XCircle size={20} color="#b91c1c" />;
              }
            } else if (isSelected) {
              borderColor = "border-indigo-600";
              bgColor = "bg-indigo-50";
              textColor = "text-indigo-700";
              IconIndicator = (
                <View className="w-5 h-5 rounded-full border-[5px] border-indigo-600" />
              );
            }

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => handleSelectOption(index)}
                disabled={isConfirmed}
                className={`flex-row items-center px-4 py-3 rounded-2xl border-2 ${borderColor} ${bgColor}`}
              >
                <View className="mr-4">{IconIndicator}</View>
                <Text
                  className={`flex-1 font-medium ${isSmallScreen ? "text-sm" : "text-base"} ${textColor}`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* botão de confirmar resposta, ver resultado e próxima */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={selectedOption === null}
          className={`w-full p-4 rounded-2xl items-center shadow-sm ${
            selectedOption === null ? "bg-slate-300" : "bg-indigo-600"
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {!isConfirmed
              ? "Confirmar"
              : currentStepIndex === steps.length - 1
                ? "Ver Resultado"
                : "Próxima"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
