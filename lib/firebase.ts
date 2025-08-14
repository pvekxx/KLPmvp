import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// 앱 중복 초기화 방지/initializeApp()으로 Firebase 앱 생성
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 세션 유지
let _myFirebaseAuth;
try {
    _myFirebaseAuth = initializeAuth(firebaseApp, {
        // 로그인 정보AsyncStorage저장
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch {
    // 이미 초기화된 경우 재사용
    _myFirebaseAuth = getAuth(firebaseApp);
}

export const myFirebaseAuth = _myFirebaseAuth;

export const db = getFirestore(firebaseApp);