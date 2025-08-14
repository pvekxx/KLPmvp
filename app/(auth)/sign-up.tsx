import { View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuthFormHook } from "../../hooks/useAuthFormHook";
import AuthInput from "../../components/AuthInput";
import AppButton from "../../components/AppButton";
import AuthHeader from "../../components/AuthHeader";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignUp() {
    const { email, password, setEmail, setPassword, pending, error, handleSubmit } =
        useAuthFormHook({
            mode: "signUp",
        });

    return (
        <View style={styles.container}>
            <View>
                <AuthHeader
                    title="계정 생성"
                    subtitle="앱을 사용하려면 계정을 만들어 주세요."
                />
                <Pressable style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color="#FAFAF8" />
                </Pressable>
            </View>
            <AuthInput placeholder="Email Address" value={email} onChangeText={setEmail} />
            <AuthInput placeholder="Password" value={password} onChangeText={setPassword} secure />
            <AppButton title="시작하기" onPress={handleSubmit} loading={pending} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        gap: 12
    },
    backBtn: {
        position: "absolute",
        right: 0,
        padding: 8,
    },
});
