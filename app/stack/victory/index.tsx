import { FIRESTORE, AUTH } from '@/firebaseconfig';
import { router } from 'expo-router';
import { collection, getDoc, doc, runTransaction } from 'firebase/firestore';
import { useLayoutEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';

const Victory = () => {

    const [winnings, setWinnings] = useState(0);

    useLayoutEffect(() => {

        const email: string = AUTH.currentUser?.email;

        runTransaction(FIRESTORE, async (transaction) => {

            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');
            const snap = await getDoc(dRef);
            const tourWinnings = snap.data()?.prize_fund;
            setWinnings(tourWinnings);

            // update players document

            const userColRef = collection(FIRESTORE, 'users');
            const userDocRef = doc(userColRef, email);
            const userSnap = await getDoc(userDocRef);
            const userTotalWinnings = userSnap.data()?.total_winnings ? userSnap.data()?.total_winnings : 0;
            console.log(userTotalWinnings)
            transaction.update(userDocRef,  { total_winnings: userTotalWinnings + tourWinnings }  );

        });

        // reset tournament document

    }, [])

    return (
        <View>
            <Text>Congratulations you have been victorious!</Text>
            <Text>Credits won: {winnings ? winnings : 0}</Text>
            <Text>The above winnings will be added to your account.</Text>
            <Pressable onPress={() => router.navigate('/stack/home')}>
                <Text>Navigate home</Text>
            </Pressable>
        </View>
    )
}

export default Victory;