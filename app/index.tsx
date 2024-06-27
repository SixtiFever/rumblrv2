import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, View, Pressable, TextInput, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AUTH, FIRESTORE } from "@/firebaseconfig";
import { collection, doc, getDoc } from "firebase/firestore";

export default function Index() {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const handleLogin = async () => {
        if ( email != null && password != null ) {

            const userCred = await signInWithEmailAndPassword(AUTH, email, password).then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                return user;
                // // if user in current tournament, navigate to lobby
                // const tournamentCollectionRef = collection(FIRESTORE, 'tournaments');
                // const 

                // router.navigate("/stack/home");
                // // ...
              }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return 0;
              });

            
              // if successfully signed in
              if ( userCred.email ) {
                const playerInTour = await checkPlayerInTournament(userCred);

                // if player in tournament, go to lobby. Otherwise go to home
                const dummy = playerInTour == 1 ? router.navigate('/stack/lobby') : router.navigate('/stack/home');

              } else {
                console.log('Issue signing in')
              }

        }
    }


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

    <TextInput style={styles.textInput} placeholder="Email" onChangeText={setEmail} />
    <TextInput style={styles.textInput} placeholder="Password" onChangeText={setPassword} />

      {/* <Link href="/(tabs)/home" asChild> */}
        <Pressable style={styles.pressable} onPress={handleLogin}>
            <Text style={styles.pressableText}>Login</Text>
        </Pressable>
      {/* </Link> */}

      <Link href="signup" asChild>
        <Text style={styles.linkText}>Go to signup</Text>
      </Link>
    </View>
  );
}


async function checkPlayerInTournament(user: any) {
    const cRef = collection(FIRESTORE, 'tournaments');
    const dRef = doc(cRef,'1');
    const snap = await getDoc(dRef);
    const players = snap.data()?.players;

    // if there are players in the tournament
    if ( players ) {

        // iterate object in search of player email
        for ( let player of Object.entries(players) ) {
            if ( user.email === player[0] ) {
                console.log('Player found')
                return 1;
            }
        }
        return 0;
    } else {
        console.log('No players in tournament')
    }
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