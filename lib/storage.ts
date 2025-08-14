import * as FileSystem from "expo-file-system";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";

export async function uploadImageAsync(localUri: string, path: string) {
    // 앱 옵션에서 storageBucket 읽기
    const app = getApp();
    const bucket = app.options.storageBucket as string;
    if (!bucket) throw new Error("storageBucket 미설정");

    // 인증된 사용자 필요
    const user = getAuth().currentUser;
    if (!user) throw new Error("로그인 필요");

    // Firebase ID 토큰 (Bearer 토큰으로 REST 호출 인증)
    const idToken = await user.getIdToken();
    // 업로드 엔드포인트 (name=에 object path를 URL 인코딩하여 지정)
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodeURIComponent(path)}`;

    // 파일 자체를 바이너리로 업로드 Expo FileSystem - uploadAsync 사용
    const res = await FileSystem.uploadAsync(url, localUri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT, // - uploadType: BINARY_CONTENT (파일 본문 전송)
        headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "image/jpeg",
        },
    });

    if (res.status !== 200) throw new Error(`Upload failed: ${res.status} ${res.body}`);

    const payload = JSON.parse(res.body);
    // 응답 본문에 downloadTokens가 들어있을 수도
    const token = payload.downloadTokens as string | undefined;
    // 다운로드 URL 조립
    // alt=media: 실제 파일 바이너리 반환
    // token=...: 비공개 파일 접근 시 필요 (규칙에 따라 없을 수도)
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media${token ? `&token=${token}` : ""}`;
}

export async function deleteImageByPath(path: string) {
    const app = getApp();
    const bucket = app.options.storageBucket as string;
    if (!bucket) throw new Error("storageBucket 미설정");

    const user = getAuth().currentUser;
    if (!user) throw new Error("로그인 필요");

    const idToken = await user.getIdToken();
    // 객체 삭제 엔드포인트
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}`;

    const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}