import { Stack } from "expo-router";
import { View, Text } from "react-native"


const Layout = () => {
    return (
        <Stack screenOptions={{
            headerBackVisible: false,
        }} />
    )
}

export default Layout;