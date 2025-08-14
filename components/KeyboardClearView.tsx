import { Keyboard, TouchableWithoutFeedback, View, ViewProps } from "react-native";

export default function KeyboardClearView({ children, ...rest }: ViewProps) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }} {...rest}>{children}</View>
        </TouchableWithoutFeedback>
    );
}