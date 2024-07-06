import { AUTH, FIRESTORE } from "@/firebaseconfig";
import { useNavigation, router } from "expo-router";
import { collection, doc, getDoc, memoryEagerGarbageCollector, onSnapshot, runTransaction } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const Home = () => {

    const nav = useNavigation();

    const [prizeFund, setPrizeFund] = useState(0);
    const [startDate, setStartDate] = useState([]);
    const [playerCount, setPlayerCount] = useState(0);
    const [tourActive, setTourActive] = useState(false);
    const [entryFee, setEntryFee] = useState(0);

    useLayoutEffect(() => {

        nav.setOptions({
            title: 'Rumblr',
            headerRight: () => <GeneratePlayers playerCount={25} />
        });

        const cRef = collection(FIRESTORE, 'tournaments');
        const dRef = doc(cRef, 'active');

        onSnapshot(dRef,(doc) => {

            // monitor whether tournament has started
            if ( doc.data()?.tournament_active == true ) {
                setTourActive(true);
            } else {
                setTourActive(false);
            }

            setPrizeFund(doc.data()?.prize_fund);
            setEntryFee(doc.data()?.entry_fee);

            const playerCountObject = doc.data()?.players ?? 0;
            setPlayerCount(Object.entries(playerCountObject).length);

            console.log(doc.data().start_date);
            // setStartDate(doc.data().start_date);
        })

    }, [])

    const handleTournamentSignup = async () => {

        runTransaction(FIRESTORE, async (transaction) => {
            const email = AUTH.currentUser?.email ?? 'default-email';
            // check if user has enough credits
            const userColRef = collection(FIRESTORE, 'users');
            const userDocRef = doc(userColRef, email);
            const userSnap = await getDoc(userDocRef);
            let credits = userSnap.data()?.total_winnings;

            if ( credits < entryFee ) {
                alert('You don\'t have enough credits to join the tournament');
                return;
            }

            credits -= entryFee;
            transaction.update(userDocRef, { total_winnings: credits });

            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');
            const snap = await getDoc(dRef);

            // check if player in tournament

            // update tournament document with player and prize fund update
            const totalCredits = snap.data()?.total_credits;
            const updatedPrizeFund = snap.data()?.prize_fund + ( Math.round(entryFee / 2) );
            const players = snap.data()?.players
            
            transaction.set(dRef, { prize_fund: updatedPrizeFund }, {merge: true});
            transaction.set(dRef, { total_credits: totalCredits }, {merge: true});
            transaction.set(dRef, { players: { [AUTH.currentUser?.email]: { 'score': 0, 'eliminated': false } } }, {merge: true});

            return router.navigate('/stack/lobby');
        }).catch(err => {
            console.log("<home/index.tsx/handleJoinTournament>" + err);
        });
    }

    return (
        <View>
            <Text>Current tournament</Text>
            <Text>Player count: { playerCount ? playerCount : 0 }</Text>
            <Text>Credit entry fee: { entryFee ? entryFee : 0 }</Text>
            <Text>Winnings pot: { prizeFund ? prizeFund : 0 } credits</Text>
            <Text>Start date: {startDate ? startDate : 'Pending'}</Text>
            <Text>Game: </Text>
            <Pressable disabled={ tourActive ? true : false } style={styles.pressable} onPress={handleTournamentSignup}>
                <Text style={styles.pressableText}>Join tournament for £1</Text>
            </Pressable>
        </View>
    )
}



const GeneratePlayers = ({playerCount}) => {
    // generates 100 players into the tournament

    function genPlayers(playerCount: number) {

        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');
            const snap = await getDoc(dRef);

            let playersObject = {}
            const entryFee = snap.data()?.entry_fee;  // assign tour credit entry fee
            const totalCredits = playerCount * entryFee;  // calculate total credits tournament has accumulated

            for ( let i = 0; i < playerCount; i++ ) {
                const player = {
                    'score': 0,
                    'eliminated': false,
                }
                const email = `${i+1}@email.com`;
                playersObject[email] = player;
            }

            transaction.update(dRef, { total_credits: totalCredits })
            transaction.update(dRef, { players: playersObject });
            transaction.update(dRef, { round: 1 });
            transaction.update(dRef, { prize_fund: Math.round(totalCredits / 2)} );
        })

    }

    function resetTournament() {
        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');

            transaction.update(dRef, { players: {} });
            transaction.update(dRef, { prize_fund: 0 });
        });
    }

    return (
        <Pressable onPress={() => genPlayers(playerCount)} onLongPress={resetTournament}>
            <Text>Gen</Text>
        </Pressable>
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