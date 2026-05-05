import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#7c3aed',
                tabBarInactiveTintColor: '#6b7280',
                tabBarStyle: { borderTopColor: '#e5e7eb', paddingBottom: 4 },
                tabBarLabelStyle: { fontSize: 10 },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="faits"
                options={{
                    title: 'Faits',
                    tabBarIcon: ({ color, size }) => <Ionicons name="bulb-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="respiration"
                options={{
                    title: 'Respiration',
                    tabBarIcon: ({ color, size }) => <Ionicons name="cloud-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="emotions"
                options={{
                    title: 'Émotions',
                    tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profil"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
