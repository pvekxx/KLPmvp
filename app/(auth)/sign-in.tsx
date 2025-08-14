import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useAuthFormHook } from "../../hooks/useAuthFormHook";
import AuthInput from "../../components/AuthInput";
import AppButton from "../../components/AppButton";
import AuthHeader from "../../components/AuthHeader";

export default function SignIn() {
    const { email, password, setEmail, setPassword, pending, error, handleSubmit } =
        useAuthFormHook({
            mode: "signIn",
        });

    return (
        <View style={styles.container}>
            <AuthHeader title="안녕하세요" />
            <AuthInput placeholder="Email Address" value={email} onChangeText={setEmail} />
            <AuthInput placeholder="Password" value={password} onChangeText={setPassword} secure />
            <AppButton title="로그인" onPress={handleSubmit} loading={pending} />
            <AppButton
                title="계정 생성"
                onPress={() => router.push("/sign-up")}
                disabled={pending}
            />
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
});