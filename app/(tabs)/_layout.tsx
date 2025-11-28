import { Tabs } from 'expo-router';
import { BookHeart, Compass, Home, User } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#94A3B8',

        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },

        tabBarLabelStyle: {
          fontFamily: 'Nunito_600SemiBold',
          fontSize: 12,
        },
      }}
    >
      {/* opt home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* opt explorar */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <Compass size={24} color={color} />,
        }}
      />

      {/* opt diario */}
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Diário',
          tabBarIcon: ({ color }) => <BookHeart size={24} color={color} />,
        }}
      />

      {/* opt perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}