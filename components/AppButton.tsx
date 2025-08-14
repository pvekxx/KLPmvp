import { ActivityIndicator, Pressable, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";

type Variant = "white" | "red";
type Props = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: Variant; // 기본값 white
    style?: StyleProp<ViewStyle>;
};

const BG: Record<Variant, string> = {
    white: "#FAFAF8",
    red: "#A33",
};

const FG: Record<Variant, string> = {
    white: "#1A1A1A",
    red: "#FAFAF8",
};

export default function AppButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = "white",
    style,
}: Props) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.base,
                { backgroundColor: isDisabled ? "#9E9E9E" : BG[variant] },
                pressed && !isDisabled && { opacity: 0.9 },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={FG[variant]} />
            ) : (
                <Text style={[styles.text, { color: FG[variant] }]}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "700",
    },
});