import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { runTransaction, collection, doc, getDoc, DocumentSnapshot, onSnapshot } from 'firebase/firestore';
import { AUTH, FIRESTORE } from '@/firebaseconfig';

const Lobby = () => {

    const nav = useNavigation();

    const [tournamentData, setTournamentData] = useState(null);
    const [prizeFund, setPrizeFund] = useState(0);
    const [startDate, setStartDate] = useState([]);
    const [playerCount, setPlayerCount] = useState(0);
    const [tournamentActive, setTournamentActive] = useState(false);

    useLayoutEffect(() => {
        
        // configure navbar
        nav.setOptions({
            title: 'Lobby',
            headerLeft: () => <ExitIcon />,
        });


        (async () => {
            const status = await getTourStatus();
            setTournamentActive(status);
        })();


        const cRef = collection(FIRESTORE, 'tournaments');
        const dRef = doc(cRef, 'active');


        // listener for tournament document changes
        onSnapshot(dRef, snap => {

            // set tournament active status based on firestore field
            setTournamentActive(snap.data().tournament_active);

            setTournamentData(snap.data());
            
            // if ( snap.data().tournament_active == true) {
            //     // Navigate player to from Lobby to PlayRound
            //     // router.navigate('/stack/round/')

            // }
        });

    }, [tournamentActive]);

    function startTournament() {
        // set tournament active to true
        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');
            transaction.update(dRef, { tournament_active: true });
            transaction.update(dRef, { round_active: true });
        });

        router.navigate('/stack/round/')
    }


    return (
        <View style={styles.container}>
            <Text>Player count {Object.entries(tournamentData?.players ?? {}).length}</Text>
            <Text>Prize fund {tournamentData?.prize_fund} credits</Text>
            <Text>Next round {tournamentData?.round}</Text>
            { tournamentActive && tournamentData?.round_active == true ? 
                <Text>In progress</Text> 
                :
                <Pressable onPress={startTournament}>
                    <Text>Start round</Text>
                </Pressable> }
        </View>
    )
}


async function getTourStatus() {
    const cRef = collection(FIRESTORE, 'tournaments');
    const dRef = doc(cRef, 'active');
    const snap = await getDoc(dRef);
    if ( snap.data().tournament_active == true ) {
        return true;
    }
    return false;
}

const ExitIcon = () => {

    const handleLeaveTournament = () => {

        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');

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
    }

    return (
        <Pressable onPress={alertLeaveTournament}>
            <Ionicons name='exit-outline' size={24} />
        </Pressable>
    )
}


// const ActivateTournament = () => {

//     function startTournament() {
//         // set tournament active to true
//         runTransaction(FIRESTORE, async (transaction) => {
//             const cRef = collection(FIRESTORE, 'tournaments');
//             const dRef = doc(cRef, '1');
            
//             transaction.update(dRef, { tournament_active: true });
//         })
//     }

//     return (
//         <Pressable disabled={false} onPress={() => startTournament()}>
//             <Text>Start</Text>
//         </Pressable>  
//     )
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Lobby;