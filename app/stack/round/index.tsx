import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native"
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'


const PlayRound = () => {

    const nav = useNavigation();

    useLayoutEffect(() => {

        nav.setOptions({
            title: 'Round Starting',
        });

    }, []);


    const startRound = () => {
        console.log('Start round called')
        router.navigate('/stack/play_game');
    }

    return (
        <View style={styles.container}>
            <Text>Get ready to rumble!</Text>

            <CountdownCircleTimer
                isPlaying
                duration={3}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                onComplete={startRound} >

                    {({ remainingTime }) => <Text>{remainingTime}</Text>}

            </CountdownCircleTimer>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default PlayRound;