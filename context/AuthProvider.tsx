import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { myFirebaseAuth } from '../lib/firebase';

type Ctx = {
    user: User | null;
    loading: boolean
};

// 컨텍스트 생성
const AuthCtx = createContext<Ctx>({ user: null, loading: true });

export const useAuthCtx = () => useContext(AuthCtx);

// 앱 트리 감싸 줄 Provider
export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    //로그인상태 구독
    useEffect(() => {
        // 앱 시작 시 세션 복원
        // 로그인/로그아웃 때마다 콜백 호출
        const unsub = onAuthStateChanged(myFirebaseAuth, (u) => {
            setUser(u); // Firebase가 준 사용자 객체set
            setLoading(false); // 결과받으면 로딩 종료
        });
        return unsub;
    }, []);

    // 자식 컴포넌트에게 {user, loading} 값 공급
    return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>;
}