import { useState } from "react";
import { View, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthCtx } from "../../../../context/AuthProvider";
import { uploadImageAsync } from "../../../../lib/storage";
import { createPost } from "../../../../lib/posts";
import { router } from "expo-router";
import AppButton from "../../../../components/AppButton";

export default function Compose() {
    const { user } = useAuthCtx();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imgUri, setImgUri] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다.");
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.85,
                selectionLimit: 1,
            });
            if (!result.canceled && result.assets?.length > 0) {
                setImgUri(result.assets[0].uri);
            }
        } catch {
            Alert.alert("오류", "이미지 선택 실패.");
        }
    };

    const submit = async () => {
        if (pending) return;
        if (!user) { Alert.alert("안내", "로그인이 필요합니다."); return; }
        if (!title.trim() || !content.trim()) {
            Alert.alert("안내", "제목과 내용을 입력하세요.");
            return;
        }

        try {
            setPending(true);
            let imageUrl: string | null = null;
            let imagePath: string | null = null;

            if (imgUri) {
                const path = `posts/${user.uid}/${Date.now()}.jpg`;
                imageUrl = await uploadImageAsync(imgUri, path);
                imagePath = path;
            }

            await createPost({
                title: title.trim(),
                content: content.trim(),
                uid: user.uid,
                imageUrl,
                imagePath,
            });

            setTitle(""); setContent(""); setImgUri(null);
            router.replace("/list");
        } catch {
            Alert.alert("오류", "작성 실패.");
        } finally {
            setPending(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <TextInput
                placeholder="글의 제목을 입력해주세요."
                placeholderTextColor="#9E9E9E"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                    color: "#FAFAF8",
                    borderWidth: 1, borderColor: "#3A3A3A",
                    borderRadius: 16, padding: 12
                }}
            />
            <TextInput
                placeholder="글의 내용을 입력해주세요."
                placeholderTextColor="#9E9E9E"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                style={{
                    color: "#FAFAF8",
                    borderWidth: 1, borderColor: "#3A3A3A",
                    borderRadius: 16, padding: 12, minHeight: 240
                }}
            />

            {imgUri && (
                <Image
                    source={{ uri: imgUri }}
                    style={{ width: "100%", height: 220, borderRadius: 8 }}
                    resizeMode="contain"
                />
            )}

            <View style={{ flexDirection: "row", gap: 16 }}>
                <AppButton
                    title="이미지 선택"
                    onPress={pickImage}
                    variant="white"
                    style={{ flex: 1 }}
                />
                <AppButton
                    title={pending ? "게시 중..." : "게시"}
                    onPress={submit}
                    loading={pending}
                    style={{ flex: 1 }}
                />
            </View>
        </View>
    );
}