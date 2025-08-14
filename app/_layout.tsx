import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '../context/AuthProvider';
import { StatusBar } from "expo-status-bar";
import KeyboardClearView from '../components/KeyboardClearView';

export default function RootLayout() {

    return (
        <KeyboardClearView>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar style="light" />
                <AuthProvider>
                    <Stack
                        screenOptions={{
                            contentStyle: { backgroundColor: "#1A1A1A" }
                        }}
                    >
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="(app)" options={{ headerShown: false }} />
                    </Stack>
                </AuthProvider>
            </GestureHandlerRootView>
        </KeyboardClearView>
    );
}