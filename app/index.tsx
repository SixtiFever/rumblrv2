import { Link, router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Text, View, Pressable, TextInput, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AUTH, FIRESTORE } from "@/firebaseconfig";
import { collection, doc, getDoc } from "firebase/firestore";

export default function Index() {

    const nav = useNavigation();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    useLayoutEffect(() => {

        nav.setOptions({
            headerRight: () => <Admin />
        })

    }, [])

    const handleLogin = async () => {
        if ( email != null && password != null ) {

            const userCred = await signInWithEmailAndPassword(AUTH, email, password).then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                return user;

              }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return 0;
              });

            
              // if successfully signed in
              if ( userCred.email ) {

                // if code = [1,0] => navigate to lobby, else navigate to home.
                const tournamentStatusCode = await checkTournamentState(userCred);

                if ( Array.isArray(tournamentStatusCode) && tournamentStatusCode[0] == 1 && tournamentStatusCode[1] == 0  ) {
                    // player can go to lobby ( is in tournament && tournment is not active )
                    router.navigate('/stack/lobby')
                } else {
                    // navigate to home -> Player not in tournament or tournament is currently active
                    router.navigate('/stack/home')
                }

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


async function checkTournamentState(user: any) {
    const cRef = collection(FIRESTORE, 'tournaments');
    const dRef = doc(cRef,'1');
    const snap = await getDoc(dRef);
    const players = snap.data()?.players;

    let code = [];  // holds [ player in tournament, tournament active status ] E.g [1,0] player present and tour active

    // if there are players in the tournament
    if ( players ) {

        // iterate object in search of player email
        for ( let player of Object.entries(players) ) {
            if ( user.email === player[0] ) {
                console.log('Player found')
                code.push(1);
            }
        }
    } else {
        return [0,0];
    }

    if ( snap.data().tournament_active == false ) {
        code.push(0);
    }
    console.log(code);
    return code;
}

const Admin = () => {

    const toAdmin = () => {

        router.navigate('/admin');

    }

    return (
        <Pressable onPress={toAdmin}>
            <Text>Admin</Text>
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