import { Link } from "expo-router"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native"
import { AUTH, FIRESTORE } from '../firebaseconfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, addDoc, getDoc, setDoc } from "firebase/firestore";


const Signup = () => {

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const handleSignup = async () => {
        if ( username != null && email != null && password != null) {

            const p = await createAuthenticatedUser(password, email, AUTH);
            if ( p == 1 ) {
                await createUserDoc(email, password);
            } else {
                console.log('User already exists')
            }

        } else {
            alert('Fields not entered correctly')
        }
    }


    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} placeholder="Username" onChangeText={setUsername} />
            <TextInput style={styles.textInput} placeholder="Email" onChangeText={setEmail} />
            <TextInput style={styles.textInput} placeholder="Password" onChangeText={setPassword} />

            {/* <Link href="" asChild> */}
                <Pressable style={styles.pressable} onPress={() => handleSignup()}>
                    <Text style={styles.pressableText}>Signup</Text>
                </Pressable>
            {/* </Link> */}
        </View>
    )
}

export default Signup;

async function createAuthenticatedUser (password: string, email: string, auth: any) {


    let code = await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log('Signed up');
        return 1;
        // ...
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        return 0;
        // ..
    });
    return code;
}

async function createUserDoc(e: string, p: string) {
    const email = e.toLowerCase();
    const cRef = collection(FIRESTORE, 'users');
    const dRef = doc(cRef, email);
    await setDoc(dRef, { email: email, password:  p, total_winnings: 0 });
    console.log('User added to user document');
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