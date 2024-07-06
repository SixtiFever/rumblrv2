import { AUTH, FIRESTORE } from '@/firebaseconfig';
import { router } from 'expo-router';
import { collection, getDoc, doc, runTransaction, orderBy } from 'firebase/firestore';
import { useLayoutEffect, useState } from 'react';
import {View, Text, Pressable} from 'react-native';

const Results = () => {

    const [eliminated, setEliminated] = useState(false);
    const [orderedPlayers, setOrderedPlayers] = useState(null);
    const [winner, setWinner] = useState(null);

    useLayoutEffect(() => {

        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');
            const snap = await getDoc(dRef);

            let playerArray = Object.entries(snap.data().players);
            playerArray.sort(( [, a], [, b] ) => b.score - a.score);

            // Winner is player at index 0 -> Navigates to winner page.
            if ( playerArray.length <= 2 ) {
                const [winner, loser] = playerArray;
                console.log(JSON.stringify(winner));
                console.log(JSON.stringify(loser));
                // assign winner and loser in tournament document
                transaction.update(dRef, { winner: winner[0] });
                transaction.update(dRef, { runner_up: loser[0] });

                // reset tournament data
                transaction.update(dRef, { tournament_active: false });
                transaction.update(dRef, { round_active: false });
                transaction.update(dRef, { players: {} });
                transaction.update(dRef, { round: 0 });

                if ( AUTH.currentUser?.email == winner[0] ) {
                    console.log('Navigating to winner screen');
                    return router.navigate('/stack/victory');
                } else {
                    console.log('Navigating to runner-up screen');
                    return router.navigate('/stack/home');
                }
            }

            const winners = playerArray.splice(0, (playerArray.length - 1) / 2);
            let winnerPlayerObject = Object.fromEntries(winners);
            transaction.update(dRef, { players: winnerPlayerObject });
            transaction.update(dRef, { round_active: false });
            transaction.update(dRef, { round: snap.data().round + 1 });
            
            if ( winnerPlayerObject != null && winnerPlayerObject[AUTH.currentUser?.email] != null ) {
                setEliminated(false);
            } else {
                setEliminated(true);
            }
        });

    }, []);

    const onProceed = () => {
        if ( eliminated ) {
            router.navigate('/stack/eliminated');
        } else {
            router.navigate('/stack/lobby');
        }
    }

    return (
        <View>
            <Text>Calculating results</Text>
            <Text>progression status { !eliminated ? 'Victory' : 'Eliminated' }</Text>
            <Pressable onPress={onProceed}>
               <Text>Proceed</Text>
            </Pressable>
        </View>
    )
}

export default Results;