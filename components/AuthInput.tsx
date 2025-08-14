import { TextInput, StyleSheet } from "react-native";

export default function AuthInput({ value, onChangeText, placeholder, secure }: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secure?: boolean;
}) {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#9E9E9E"
            selectionColor="#FAFAF8"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secure}
            autoCapitalize="none"
            style={styles.input}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderColor: "#FAFAF8",
        padding: 12,
        borderBottomWidth: 1,
        color: "#FAFAF8",
    },
});