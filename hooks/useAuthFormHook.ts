import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, } from "firebase/auth";
import { myFirebaseAuth } from "../lib/firebase";

type Mode = "signIn" | "signUp";

type UseAuthFormOpts = {
    mode: Mode;
    initialEmail?: string;
    initialPassword?: string;
    onSuccess?: (cred: UserCredential) => void | Promise<void>;
    validate?: (email: string, password: string) => string | null;
};

export function useAuthFormHook({
    mode,
    initialEmail = "",
    initialPassword = "",
    onSuccess,
    validate,
}: UseAuthFormOpts) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 검증
    const defaultValidate = useCallback((e: string, p: string) => {
        if (!e.trim() || !p.trim()) return "이메일/비밀번호를 입력하세요.";
        if (!e.includes("@")) return "이메일 형식을 확인하세요.";
        if (p.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
        return null;
    }, []);

    const validateFn = validate ?? defaultValidate;

    const handleSubmit = useCallback(async () => {
        const e = email.trim();
        const p = password.trim();

        const msg = validateFn(e, p);
        if (msg) {
            setError(msg);
            Alert.alert("안내", msg);
            return;
        }

        try {
            setPending(true);
            setError(null);

            const cred =
                mode === "signIn"
                    ? await signInWithEmailAndPassword(myFirebaseAuth, e, p)
                    : await createUserWithEmailAndPassword(myFirebaseAuth, e, p);

            if (onSuccess) await onSuccess(cred);
        } catch {
            const msg = mode === "signIn" ? "로그인에 실패했습니다." : "회원가입에 실패했습니다.";
            setError(msg);
            Alert.alert("실패", msg);
        } finally {
            setPending(false);
        }
    }, [email, password, mode, onSuccess, validateFn]);

    return {
        email,
        password,
        setEmail,
        setPassword,
        pending,
        error,
        handleSubmit,
    };
}