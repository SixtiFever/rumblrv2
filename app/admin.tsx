import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { collection, doc, runTransaction } from 'firebase/firestore';
import { FIRESTORE } from '@/firebaseconfig';

const TournamentPortal = () => {

    const [entryFee, setEntryFee] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [game, setGame] = useState('');


    const handleTournamentCreation = async () => {

        runTransaction(FIRESTORE, async (transaction) => {
            const cRef = collection(FIRESTORE, 'tournaments');
            const dRef = doc(cRef, 'active');
            
            const tourObject = {
                entry_fee: entryFee,
                players: {},
                prize_fund: 0,
                round: 1,
                round_active: false, 
                //start_date: startDate,
                total_credits: 0,
                tournament_active: false,
                game: game,
            }

            transaction.set(dRef, tourObject );

        }).catch(err => {
            console.log('admin.tsx/handleTournamentCreation - ' + err);
        })

    }


    return (
        <View style={styles.container}>
            <Text>Welcome to the tournament creation portal</Text>
            <TextInput style={styles.textInput} placeholder="Entry fee" onChangeText={(v) => setEntryFee(Number(v))} />
            <TextInput style={styles.textInput} placeholder="Start date" onChangeText={setStartDate} />
            <TextInput style={styles.textInput} placeholder="Game" onChangeText={setGame} />
            <Pressable style={styles.pressable} onPress={handleTournamentCreation}>
                <Text style={styles.pressableText}>Submit tournament</Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressable: {
        width: '80%',
        height: 60,
        backgroundColor: '#7EA0B7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 25,
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

export default TournamentPortal;