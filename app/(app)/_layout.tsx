import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthCtx } from "../../context/AuthProvider";

export default function AppLayout() {
    const { user, loading } = useAuthCtx();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user && segments[0] === "(app)") {
            router.replace("/sign-in");
        }
    }, [user, loading, segments]);


    return (
        <Stack
        // screenOptions={{
        // headerStyle: { backgroundColor: "#222" },
        // headerTintColor: "#FAFAF8",
        // contentStyle: { backgroundColor: "#1A1A1A" },
        // }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}