import { View, Text, StyleSheet } from "react-native";

type Props = {
    title: string;
    subtitle?: string;
};

export default function AuthHeader({ title, subtitle }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 8,
        paddingLeft: 8,
        gap: 8
    },
    title: {
        fontSize: 28,
        color: "#FAFAF8",
        fontWeight: "500",
    },
    subtitle: {
        fontSize: 14,
        color: "#CFCFCF",
        paddingTop: 4,
    },
});