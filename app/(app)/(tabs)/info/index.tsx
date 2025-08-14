import { View, Text, Alert, Pressable } from "react-native";
import { myFirebaseAuth } from "../../../../lib/firebase";
import { router } from "expo-router";
import { signOut } from "firebase/auth";

/////////////// 내정보 페이지
export default function InfoPage() {
    /// 로그아웃 함수
    const handleLogout = async () => {
        try {
            await signOut(myFirebaseAuth);
            router.replace("/sign-in");
        } catch (err) {
            Alert.alert("로그아웃 실패", "다시 시도해주세요.");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
            <Text style={{ color: "#FAFAF8", fontSize: 32 }}>내 정보</Text>
            <Pressable
                style={{ paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: '#FAFAF8', borderRadius: 16 }}
                onPress={handleLogout}>
                <Text style={{ color: "#FAFAF8", }}>로그아웃</Text>
            </Pressable>
        </View>
    );
}