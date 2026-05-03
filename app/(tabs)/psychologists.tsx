import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from "../../src/services/api";

// tipagem para os psicologos
export interface Psychologist {
  id: string;
  name: string;
  specialities: string[];
  crp: string;
  bio: string | null;
  avatarUrl: string | null;
  contactLink: string | null;
}

export default function PsychologistsScreen() {
  const [professionals, setProfessionals] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      const response = await api.get("/psychologists");
      setProfessionals(response.data);
    } catch (error) {
      console.error("Erro ao carregar psicólogos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (url: string | null) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderItem = ({ item }: { item: Psychologist }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.crp}>CRP: {item.crp}</Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {item.specialities.map((speciality, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{speciality}</Text>
          </View>
        ))}
      </View>

      {item.bio && (
        <Text style={styles.bio} numberOfLines={3}>
          {item.bio}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, !item.contactLink && styles.buttonDisabled]}
        onPress={() => handleContact(item.contactLink)}
        disabled={!item.contactLink}
      >
        <Text style={styles.buttonText}>Entrar em Contato</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={professionals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum profissional encontrado no momento.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, gap: 16 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: "#4f46e5" },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  crp: { fontSize: 12, color: "#64748b", marginTop: 2 },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 12, color: "#475569", fontWeight: "500" },
  bio: { fontSize: 14, color: "#334155", lineHeight: 20, marginBottom: 16 },
  button: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#cbd5e1" },
  buttonText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 40 },
});
