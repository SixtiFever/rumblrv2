import { router, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { View, Text, Pressable, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { runTransaction, collection, doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { AUTH, FIRESTORE } from '@/firebaseconfig';

const Lobby = () => {

    const nav = useNavigation();

    useLayoutEffect(() => {
        nav.setOptions({
            title: 'Lobby',
            headerLeft: () => <ExitIcon />
        });
    }, [])

    return (
        <View>
            <Text>Welcome to the tournament lobby</Text>
        </View>
    )
}


const ExitIcon = () => {

    const handleLeaveTournament = () => {

        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, '1');

            const snap: DocumentSnapshot = await getDoc(dRef);
            let updatedPlayers = {};
            for ( let player of Object.entries(snap.data().players) ) {
                if ( AUTH.currentUser?.email != player[0] ) {
                    updatedPlayers[player[0]] = player[1];
                }
            }

            // update the tournament player document
            transaction.update(dRef, { players: updatedPlayers });
        }).catch(err => {
            console.log(err);
        });

        router.navigate('/stack/home');
    }

    const alertLeaveTournament = () => {

        console.log('Leave tournament pressed');
        Alert.alert('Forefeit Tournament', 'Are you sure you want to forefeit the tournamet? Entry fee is non-refundable.', [
            {
                text: 'Forefeit',
                onPress: () => handleLeaveTournament(),
                style: 'destructive',
            },
            {
                text: 'Cancel',
                style: 'cancel',
            }
        ])
         // confirmation alert box

        // runTransaction that updates player and prize fund data in tournament document

    }

    return (
        <Pressable onPress={alertLeaveTournament}>
            <Ionicons name='exit-outline' size={24} />
        </Pressable>
    )
}


export default Lobby;