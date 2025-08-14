import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, TextInput, Alert, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthCtx } from "../../../../context/AuthProvider";
import { updatePost, deletePost, subscribePost } from "../../../../lib/posts";
import { uploadImageAsync, deleteImageByPath } from "../../../../lib/storage";
import { subscribeComments, addComment, updateComment, deleteComment } from "../../../../lib/comments";
import { useHeaderHeight } from "@react-navigation/elements";
import AppButton from "../../../../components/AppButton";
import { useFormatTime } from "../../../../hooks/useFormatTime";

//////////////////////////// 글 상세보기/ 수정보기
export default function PostDetailScreen() {
    const headerHeight = useHeaderHeight();
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthCtx();

    const [post, setPost] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);

    //////////////////////////////////// 편집 상태
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    //////////////////////////////////// 새 이미지(교체용) 로컬 URI
    const [localImageUri, setLocalImageUri] = useState<string | null>(null);

    const canEdit = !!(user?.uid && post?.uid && user.uid === post.uid);

    //////////////////////////////////// 댓글 상태
    const [comments, setComments] = useState<any[] | null>(null);
    const [cmt, setCmt] = useState("");
    const [editingCmtId, setEditingCmtId] = useState<string | null>(null);
    const [editingCmtText, setEditingCmtText] = useState("");

    const formatTime = useFormatTime();


    //////////////////////////////////// 최초 로드
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        const unsub = subscribePost(String(id), (data) => {
            setPost(data);
            setTitle(data?.title ?? "");
            setContent(data?.content ?? "");
            setLocalImageUri(null);
            setLoading(false);
        });
        return unsub;
    }, [id]);

    //////////////////////////////////// 댓글 구독
    useEffect(() => {
        if (!id) return;
        const unsub = subscribeComments(String(id), setComments);
        return unsub;
    }, [id]);

    //////////////////////////////////// 댓글 작성 함수
    const submitCmt = async () => {
        if (!user) { Alert.alert("안내", "로그인이 필요합니다."); return; }
        const text = cmt.trim();
        if (!text) return;

        try {
            await addComment(String(id), { uid: user.uid, content: text });
            setCmt("");
        } catch {
            Alert.alert("오류", "댓글 작성 실패.");
        }
    };

    //////////////////////////////////// 댓글 수정 시작
    const startEditCmt = (cid: string, text: string) => {
        setEditingCmtId(cid);
        setEditingCmtText(text);
    };

    //////////////////////////////////// 댓글 수정 저장
    const saveEditCmt = async () => {
        if (!editingCmtId) return;
        const txt = editingCmtText.trim();
        if (!txt) return;
        try {
            await updateComment(String(id), editingCmtId, txt);
            setEditingCmtId(null);
            setEditingCmtText("");
        } catch {
            Alert.alert("오류", "댓글 수정 실패.");
        }
    };

    //////////////////////////////////// 이미지 선택(교체)
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") { Alert.alert("권한 필요", "갤러리 접근 권한을 허용해주세요."); return; }

        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.85,
        });
        if (!res.canceled) setLocalImageUri(res.assets[0].uri);
    };

    //////////////////////////////////// 이미지 삭제(현재 글 이미지 제거)
    const removeImage = async () => {
        if (!canEdit || !post || (!post.imageUrl && !post.imagePath)) return;
        try {
            setPending(true);
            if (post.imagePath) {
                await deleteImageByPath(post.imagePath);
            }
            await updatePost(String(id), { imageUrl: null, imagePath: null });
            setPost({ ...post, imageUrl: null, imagePath: null });
            setLocalImageUri(null);
            Alert.alert("완료", "이미지를 삭제했습니다.");
        } catch {
            Alert.alert("오류", "이미지 삭제 실패.");
        } finally {
            setPending(false);
        }
    };

    //////////////////////////////////// 저장(제목/내용/이미지 교체)
    const save = async () => {
        if (!canEdit || !post) return;
        const t = title.trim();
        const c = content.trim();
        if (!t || !c) { Alert.alert("안내", "제목과 내용을 입력하세요."); return; }

        try {
            setPending(true);
            let newUrl: string | undefined;
            let newPath: string | undefined;

            if (localImageUri) {
                const path = `posts/${user!.uid}/${Date.now()}.jpg`;
                newUrl = await uploadImageAsync(localImageUri, path);
                newPath = path;

                try {
                    if (post.imagePath) await deleteImageByPath(post.imagePath);
                } catch {
                    Alert.alert("오류", "저장 실패.");
                }
            }

            await updatePost(String(id), {
                title: t,
                content: c,
                ...(newUrl !== undefined ? { imageUrl: newUrl, imagePath: newPath } : {}),
            });

            setPost({ ...post, title: t, content: c, imageUrl: newUrl ?? post.imageUrl, imagePath: newPath ?? post.imagePath });
            setEditing(false);
            setLocalImageUri(null);
            Alert.alert("완료", "저장되었습니다.");
        } catch {
            Alert.alert("오류", "저장 실패.");
        } finally {
            setPending(false);
        }
    };

    //////////////////////////////////// 글 삭제(문서/이미지 정리)
    const removePost = () => {
        if (!canEdit || !post) return;
        Alert.alert("삭제", "정말 삭제할까요?", [
            { text: "취소" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    try {
                        setPending(true);
                        try {
                            if (post.imagePath) await deleteImageByPath(post.imagePath);
                        } catch {
                            Alert.alert("오류", "삭제 실패.");
                        }
                        await deletePost(String(id));
                        router.back();
                    } catch {
                        Alert.alert("오류", "삭제 실패.");
                    } finally {
                        setPending(false);
                    }
                },
            },
        ]);
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    if (!post) {
        return (
            <View style={styles.container}>
                <Text style={styles.empty}>게시글을 찾을 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={headerHeight}
        >
            <ScrollView>


                <View style={styles.container}>
                    {/* 보기/편집 토글 */}
                    {editing ? (
                        <>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="제목"
                                placeholderTextColor="#9E9E9E"
                                style={styles.input}
                            />
                            <TextInput
                                value={content}
                                onChangeText={setContent}
                                placeholder="내용을 입력하세요"
                                placeholderTextColor="#9E9E9E"
                                multiline
                                style={[styles.input, { minHeight: 140 }]}
                            />

                            {/* 이미지 미리보기 (새 이미지 우선 표시) */}
                            {localImageUri ? (
                                <Image source={{ uri: localImageUri }} style={styles.image} />
                            ) : post.imageUrl ? (
                                <Image source={{ uri: post.imageUrl }} style={styles.image} />
                            ) : null}

                            <View style={{ flexDirection: "row", gap: 8 }}>
                                <AppButton
                                    title="이미지 선택/교체"
                                    variant="white"
                                    onPress={pickImage}
                                    disabled={pending}
                                    style={{ flex: 1 }}
                                />
                                {(post.imageUrl || localImageUri) && (
                                    <AppButton
                                        title={localImageUri ? "선택 취소" : "이미지 삭제"}
                                        variant="red"
                                        onPress={localImageUri ? () => setLocalImageUri(null) : removeImage}
                                        disabled={pending}
                                        style={{ flex: 1 }}
                                    />
                                )}
                            </View>

                            <View style={{ height: 8 }} />

                            <View style={{ flexDirection: "row", gap: 8 }}>
                                <AppButton
                                    title={pending ? "저장 중..." : "저장"}
                                    loading={pending}
                                    onPress={save}
                                    style={{ flex: 1 }}
                                />
                                <AppButton
                                    title="취소"
                                    variant="white"
                                    onPress={() => { setEditing(false); setLocalImageUri(null); }}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </>
                    ) : (
                        //////////////////////////////// 수정할떄 아님 일반 보기
                        <>
                            <Text style={styles.title}>{post.title}</Text>
                            <Text style={styles.meta}>작성자: {post.uid}</Text>
                            <Text style={styles.meta}>{formatTime(post.createdAt)}</Text>
                            {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="contain" />}
                            <Text style={styles.content}>{post.content}</Text>
                            {canEdit && (
                                <View style={{ flexDirection: "row", gap: 16, paddingTop: 12 }}>
                                    <AppButton
                                        title="글 수정"
                                        variant="white"
                                        onPress={() => setEditing(true)}
                                        style={{ flex: 1 }}
                                    />
                                    <AppButton
                                        title={pending ? "삭제 중..." : "삭제"}
                                        variant="red"
                                        loading={pending}
                                        onPress={removePost}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                            )}

                            {/* =================================== 댓글란=========================== */}

                            <View style={{ paddingTop: 16, gap: 8 }}>
                                <Text style={{ color: "#FAFAF8", fontWeight: "700", fontSize: 16 }}>댓글</Text>
                                {comments === null ? (
                                    <ActivityIndicator />
                                ) : comments.length === 0 ? (
                                    //////////////////////////// 댓글없을때
                                    <Text style={{ fontSize: 12, color: "#9E9E9E" }}>아직 댓글이 없어요.</Text>
                                ) :
                                    /////////////////////////////////// 댓글 있을때
                                    (
                                        comments.map((cm) => {
                                            const mine = user?.uid === cm.uid;
                                            const editingThis = editingCmtId === cm.id;
                                            return (
                                                <View
                                                    key={cm.id}
                                                    style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#2A2A2A", gap: 6 }}
                                                >
                                                    {editingThis ? (
                                                        ////////////////////////////////// 댓글 수정중일때
                                                        <>
                                                            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                                                                <TextInput
                                                                    value={editingCmtText}
                                                                    onChangeText={setEditingCmtText}
                                                                    placeholder="수정할 댓글을 입력해주세요."
                                                                    placeholderTextColor="#9E9E9E"
                                                                    style={{
                                                                        flex: 1,
                                                                        color: "#FAFAF8",
                                                                        backgroundColor: "#202020",
                                                                        borderWidth: 1,
                                                                        borderColor: "#2A2A2A",
                                                                        borderRadius: 8,
                                                                        padding: 10,
                                                                    }}
                                                                />
                                                                <View style={{ flexDirection: "row", gap: 12 }}>
                                                                    <Pressable onPress={saveEditCmt}>
                                                                        <Text style={{ color: "#FAFAF8", fontSize: 12 }}>완료</Text>
                                                                    </Pressable>
                                                                    <Pressable onPress={() => { setEditingCmtId(null); setEditingCmtText(""); }}>
                                                                        <Text style={{ color: "#FAFAF8", fontSize: 12 }}>취소</Text>
                                                                    </Pressable>
                                                                </View>
                                                            </View>
                                                        </>
                                                    ) : (
                                                        ///////////////////////댓글 수정중 아닐때 (보여주기)
                                                        <>
                                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                <View style={{ gap: 4 }}>
                                                                    <Text style={{ color: "#FAFAF8" }}>{cm.content}</Text>
                                                                    <Text style={{ color: "#9E9E9E", fontSize: 12 }}>작성자 {cm.uid}</Text>
                                                                    <Text style={{ color: "#9E9E9E", fontSize: 12 }}>{formatTime(cm.createdAt)}</Text>
                                                                </View>
                                                                {mine && (
                                                                    /////////////// 나면 수정삭제뜨는 키
                                                                    <View style={{ flexDirection: "row", gap: 12 }}>
                                                                        <Pressable onPress={() => startEditCmt(cm.id, cm.content)}>
                                                                            <Text style={{ color: "#FAFAF8", fontSize: 12 }}>수정</Text>
                                                                        </Pressable>
                                                                        <Pressable onPress={() => deleteComment(String(id), cm.id)}>
                                                                            <Text style={{ color: "#FAFAF8", fontSize: 12 }}>삭제</Text>
                                                                        </Pressable>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </>
                                                    )}
                                                </View>
                                            );
                                        })
                                    )}

                                {/*==================== 댓글입력창 ======================*/}

                                <View style={{ flexDirection: "row", gap: 8, }}>
                                    <TextInput
                                        value={cmt}
                                        onChangeText={setCmt}
                                        placeholder="댓글을 입력해주세요."
                                        placeholderTextColor="#9E9E9E"
                                        style={{
                                            flex: 1,
                                            color: "#FAFAF8",
                                            borderBottomWidth: 1,
                                            borderColor: "#FAFAF8",
                                            padding: 8,
                                        }}
                                    />
                                    <Pressable
                                        style={{ paddingHorizontal: 12, borderWidth: 1, borderColor: "#FAFAF8", borderRadius: 12, justifyContent: "center", alignItems: "center", }}
                                        onPress={submitCmt}
                                    >
                                        < Text style={{ color: "#FAFAF8", }}>등록</Text>
                                    </Pressable>
                                </View>

                            </View>
                        </>
                    )
                    }
                </View >
            </ScrollView>
        </KeyboardAvoidingView>
    );
}



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1A1A1A", padding: 16, gap: 12 },
    title: { color: "#FAFAF8", fontSize: 20, fontWeight: "700" },
    meta: { color: "#9E9E9E", fontSize: 12 },
    image: { width: "100%", height: 240, borderRadius: 8, backgroundColor: "#1A1A1A" },
    content: { color: "#CFCFCF", fontSize: 16, lineHeight: 22 },
    empty: { color: "#CFCFCF", textAlign: "center" },

    input: {
        color: "#FAFAF8",
        backgroundColor: "#202020",
        borderWidth: 1,
        borderColor: "#2A2A2A",
        borderRadius: 8,
        padding: 12,
    },
});