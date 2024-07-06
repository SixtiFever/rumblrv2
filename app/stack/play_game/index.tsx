import { AUTH, FIRESTORE } from '@/firebaseconfig';
import { router, useNavigation } from 'expo-router';
import { runTransaction, collection, doc, getDoc } from 'firebase/firestore';
import { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const PlayGame = () => {

    const nav = useNavigation();

    useLayoutEffect(() => {

        nav.setOptions({
            title: 'Play Game'
        })

    }, []);

    const generateScores = () => {
        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');

            const snap = await getDoc(dRef);

            if ( snap.exists() ) {

                let playerObject = snap.data().players;
                for ( let playerVal of Object.values(playerObject) ) {
                    playerVal['score'] = Math.round(Math.random() * 50);
                }


                playerObject[AUTH.currentUser?.email]['score'] = 150; // hardcode my score to always be highest
                transaction.update(dRef, { players: playerObject }); // update firestore player document
                console.log('Scores generated');
            }
        })
    }

    return (
        <View style={styles.container}>
            <Text>Your score: 150</Text>
            <Pressable onPress={generateScores}>
                <Text>Generate dummy scores</Text>
            </Pressable>
            <Pressable onPress={() => router.navigate('/stack/results')}>
                <Text>Go to scores</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }
})

export default PlayGame;