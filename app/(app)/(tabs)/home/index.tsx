import { View, Text } from "react-native";

/////////////// 메인페이지
export default function HomePage() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#FAFAF8", fontSize: 32 }}>메인</Text>
        </View>
    );
}