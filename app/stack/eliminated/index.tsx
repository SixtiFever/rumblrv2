import { useNavigation, router } from 'expo-router';
import { useLayoutEffect } from 'react';
import { View, Text, Pressable } from 'react-native';


const Eliminated = () => {

    const nav = useNavigation();

    useLayoutEffect(() => {

        nav.setOptions({
            title: 'Eliminated',
        });

    }, []);

    const navigateHome = () => {
        return router.navigate('/stack/home');
    }

    return (
        <View>
            <Text>You have been eliminated.</Text>
            <Pressable onPress={navigateHome}>
                <Text>Go to home</Text>
            </Pressable>
        </View>
    )
}

export default Eliminated;