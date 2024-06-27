import { AUTH, FIRESTORE } from "@/firebaseconfig";
import { useNavigation, router } from "expo-router";
import { collection, doc, getDoc, onSnapshot, runTransaction } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const Home = () => {

    const nav = useNavigation();

    const [prizeFund, setPrizeFund] = useState(0);
    const [startDate, setStartDate] = useState([]);
    const [playerCount, setPlayerCount] = useState(0);

    useLayoutEffect(() => {

        nav.setOptions({
            title: 'Rumblr'
        });

        const cRef = collection(FIRESTORE, 'tournaments');
        const dRef = doc(cRef, '1');
        onSnapshot(dRef,(doc) => {
            setPrizeFund(doc.data().prize_fund);

            const playerCountObject = doc.data().players;
            setPlayerCount(Object.entries(playerCountObject).length);

            console.log(doc.data().start_date);
            // setStartDate(doc.data().start_date);
        })

    }, [])

    const handleJoinTournament = async () => {
        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, '1');
            const snap = await getDoc(dRef);

            // check if player in tournament

            // update tournament document with player and prize fund update
            const updatedPrizeFund = snap.data().prize_fund;
            const players = snap.data().players
            
            transaction.set(dRef, { prize_fund: updatedPrizeFund + 1 }, {merge: true});
            transaction.set(dRef, { players: { [AUTH.currentUser?.email]: {} } }, {merge: true});
        }).catch(err => {
            console.log("<home/index.tsx/handleJoinTournament>" + err);
        });

        router.navigate('/stack/lobby')
    }

    return (
        <View>
            <Text>Current tournament</Text>
            <Text>Player count: { playerCount ? playerCount : 0 }</Text>
            <Text>Prize fund: £{ prizeFund ? prizeFund : 0 }</Text>
            <Text>Start date: {startDate ? startDate : 'Pending'}</Text>
            <Text>Game: </Text>
            <Pressable style={styles.pressable} onPress={handleJoinTournament}>
                <Text style={styles.pressableText}>Join tournament for £1</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    pressable: {
        width: '80%',
        height: 60,
        backgroundColor: '#7EA0B7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    pressableText: {
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    linkText: {
        color: '#001514',
        marginTop: 10,
        fontWeight: '500',
    },
    textInput: {
        width: '80%',
        height: 60,
        backgroundColor: '#FFFECB',
        marginTop: 10,
    }
})

export default Home;