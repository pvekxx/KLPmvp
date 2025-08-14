import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                // headerStyle: { backgroundColor: "#222222" },
                // headerTintColor: "#FAFAF8",
                headerShown: false,

                tabBarActiveTintColor: "#FAFAF8",
                tabBarInactiveTintColor: "#9E9E9E",
                tabBarStyle: { backgroundColor: "#222222" },
                tabBarHideOnKeyboard: true,
                sceneStyle: { backgroundColor: "#1A1A1A" },
            }}
        >
            {/* 메인 */}
            <Tabs.Screen
                name="home"
                options={{
                    title: "메인",
                    tabBarLabel: "메인",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />

            {/* 게시판 목록 */}
            <Tabs.Screen
                name="list"
                options={{
                    title: "게시판",
                    tabBarLabel: "게시판",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" color={color} size={size} />
                    ),
                }}
            />

            {/* 글 작성 */}
            <Tabs.Screen
                name="write"
                options={{
                    title: "글 작성",
                    tabBarLabel: "글 작성",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="create-outline" color={color} size={size} />
                    ),
                }}
            />

            {/* 내 정보 */}
            <Tabs.Screen
                name="info"
                options={{
                    title: "내 정보",
                    tabBarLabel: "내 정보",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}