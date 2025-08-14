import { Stack } from "expo-router";

const stackOptions = {
    headerStyle: { backgroundColor: "#222222" },
    headerTintColor: "#FAFAF8",
    headerTitleStyle: { color: "#FAFAF8" },
    contentStyle: { backgroundColor: "#1A1A1A" },
};

export default function ListStack() {
    return (
        <Stack screenOptions={stackOptions as any}>
            <Stack.Screen name="index" options={{ title: "게시판" }} />
            <Stack.Screen name="[id]" options={{ title: "" }} />
        </Stack>
    );
}