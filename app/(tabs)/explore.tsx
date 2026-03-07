import { useRouter } from "expo-router";
import { BookOpen, Lock, Map, Star, Trophy } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../src/services/api";

type Lesson = { id: number; title: string };
type Module = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  lessons: Lesson[];
};

export default function ExploreScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isReady, setIsReady] = useState(false);

  async function fetchModules() {
    try {
      const response = await api.get("/content/modules");
      setModules(response.data);

      if (response.data.length === 0) {
        setIsReady(true);
      }
    } catch (error) {
      console.log("Erro ao buscar módulos:", error);
      setIsReady(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchModules();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchModules();
  };

  const pathOffsets = [0, 30, 60, 30, 0, -30, -60, -30];

  const reversedModules = [...modules].reverse();

  const renderModule = ({ item, index }: { item: Module; index: number }) => {
    const trueModuleIndex = modules.length - 1 - index;
    const isEven = trueModuleIndex % 2 === 0;
    const headerBgColor = isEven ? "bg-indigo-500" : "bg-teal-500";

    const reversedLessons = [...item.lessons].reverse();

    return (
      <View className="mb-4">
        {/* botões da trilha */}
        <View className="items-center w-full mb-8">
          {reversedLessons.map((lesson, idx) => {
            const originalIndex = item.lessons.length - 1 - idx;
            const translateX = pathOffsets[originalIndex % pathOffsets.length];

            const isLocked = trueModuleIndex > 0 || originalIndex > 1;

            return (
              <View
                key={lesson.id}
                className="items-center mb-4"
                style={{ transform: [{ translateX }] }}
              >
                <Pressable
                  disabled={isLocked}
                  onPress={() => router.push(`/quiz/${lesson.id}`)}
                >
                  {({ pressed }) => {
                    const isDown = pressed && !isLocked;
                    return (
                      <View style={{ marginTop: isDown ? 6 : 0 }}>
                        <View
                          style={{
                            backgroundColor: isLocked ? "#CBD5E1" : "#4338CA",
                            borderRadius: 32,
                            paddingBottom: isDown ? 0 : 6,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: isLocked ? "#E2E8F0" : "#6366F1",
                              width: 64,
                              height: 64,
                              borderRadius: 32,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {isLocked ? (
                              <Lock color="#94A3B8" size={24} />
                            ) : (
                              <Star color="white" fill="white" size={28} />
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  }}
                </Pressable>

                <Text
                  className={`font-bold mt-2 text-center ${isLocked ? "text-slate-400" : "text-text"}`}
                  style={{ width: 110, fontSize: 14 }}
                  numberOfLines={2}
                >
                  {lesson.title}
                </Text>
              </View>
            );
          })}
        </View>

        {/* header dos modulos */}
        <View className="px-4 mb-10">
          <View
            className={`rounded-3xl ${headerBgColor} px-6 py-6`}
            style={{
              borderBottomWidth: 6,
              borderBottomColor: isEven ? "#3730A3" : "#0F766E",
            }}
          >
            <View className="flex-row items-center mb-2">
              <BookOpen color="white" size={24} className="mr-3" />
              <Text className="font-bold text-white/90 text-sm uppercase tracking-widest">
                Unidade {trueModuleIndex + 1}
              </Text>
            </View>
            <Text className="font-bold text-2xl text-white mb-2 leading-8">
              {item.title}
            </Text>
            <Text className="font-regular text-white/80 text-base">
              {item.description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        ref={flatListRef}
        data={reversedModules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderModule}
        contentContainerStyle={{
          paddingTop: 40,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
          />
        }

        style={{ opacity: isReady ? 1 : 0 }}
        onContentSizeChange={() => {
          if (!isReady && modules.length > 0) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: false });
              setIsReady(true);
            }, 100);
          }
        }}

        onLayout={() => {
          if (!isReady && modules.length > 0) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: false });
              setIsReady(true);
            }, 100);
          }
        }}

        ListHeaderComponent={
          <View className="px-6 mb-10 items-center justify-center">
            <View className="bg-yellow-100 p-4 rounded-full mb-3">
              <Trophy color="#EAB308" size={32} />
            </View>
            <Text className="font-bold text-text text-lg text-center">
              Você chegou ao topo!
            </Text>
            <Text className="font-regular text-textLight text-center mt-1">
              Em breve, novos desafios.
            </Text>
          </View>
        }
        ListFooterComponent={
          <View className="px-6 mb-10 items-center flex-row justify-center mt-8">
            <Map color="#CBD5E1" size={20} className="mr-2" />
            <Text className="font-bold text-textLight uppercase tracking-widest text-sm">
              Início da Jornada
            </Text>
          </View>
        }
      />

      {(!isReady || loading) && (
        <View className="absolute inset-0 items-center justify-center bg-background">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      )}
    </SafeAreaView>
  );
}
