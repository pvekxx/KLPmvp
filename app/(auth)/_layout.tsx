import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthCtx } from "../../context/AuthProvider";

export default function AuthLayout() {
    const { user, loading } = useAuthCtx();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        // 로그인된 상태로 (auth) 접근 시 앱 홈으로
        if (user && segments[0] === "(auth)") {
            router.replace("/home");
        }
    }, [user, loading, segments]);

    return <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1A1A1A" }
    }} />;
}

// 가드 레이아웃