import { Stack } from "expo-router";

const stackOptions = {
    headerStyle: { backgroundColor: "#222222" },
    headerTintColor: "#FAFAF8",
    headerTitleStyle: { color: "#FAFAF8" },
    contentStyle: { backgroundColor: "#1A1A1A" },
};


export default function WriteStack() {
    return (
        <Stack screenOptions={stackOptions as any}>
            <Stack.Screen name="index" options={{ title: "글 작성" }} />
        </Stack>
    );
}