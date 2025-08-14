import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { subscribePosts } from "../../../../lib/posts";
import { Link } from "expo-router";
import { useFormatTime } from "../../../../hooks/useFormatTime";

////////////// 글 목록(게시판)
export default function ListPage() {
    const [items, setItems] = useState<any[] | null>(null);
    const formatTime = useFormatTime();

    useEffect(() => {
        const unsub = subscribePosts((list) => {
            setItems(list);
        });
        return unsub;
    }, []);

    if (!items) return <ActivityIndicator style={{ flex: 1 }} />;
    if (items.length === 0) {
        return (
            <View style={{ flex: 1, padding: 16, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#9E9E9E" }}>아직 게시글이 없어요. 글을 작성해주세요.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={items}
                keyExtractor={(it) => it.id}
                renderItem={({ item }) => (
                    <Link
                        href={{ pathname: "/list/[id]", params: { id: item.id } }}
                        asChild
                    >
                        <Pressable style={{ paddingVertical: 12 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", gap: 8 }}>
                                    <Text style={{ color: "#FAFAF8", fontSize: 16, fontWeight: "700" }}>
                                        {item.title}
                                    </Text>
                                    <Text style={{ color: "#FAFAF8" }}>({item.commentCount || 0})</Text>
                                </View>
                                <Text style={{ color: "#9E9E9E" }}>{formatTime(item.createdAt)}</Text>
                            </View>
                            <Text style={{ color: "#9E9E9E" }}>
                                작성자 : {item.uid}
                            </Text>
                        </Pressable>
                    </Link>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#3A3A3A" }} />}
            />
        </View>
    );
}