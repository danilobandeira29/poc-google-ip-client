import './App.css';
import { initializeApp } from "firebase/app";
import { GithubAuthProvider, getAuth, signInWithPopup, getAdditionalUserInfo, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react";

function App() {
    const app = initializeApp({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    function loginWithGithub() {
      const provider = new GithubAuthProvider();
      const auth = getAuth(app)

        signInWithPopup(auth, provider)
            .then((userCredential) => {
                const credential = GithubAuthProvider.credentialFromResult(userCredential);
                const token = credential.accessToken;
                const user = userCredential.user;
                console.log(user, token)
                getAdditionalUserInfo(userCredential)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                console.log({
                    errorMessage, errorCode, email, credential
                })
            });
    }

    const [email, setEmail] = useState("danilo.bandeira@wisereducacao.com")
    const [password, setPassword] = useState("")

    function loginWithEmailAndPassword() {
        const auth = getAuth(app)
        console.log(email)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential.user)
                setIsLoggedIn(true)
                console.log(getAdditionalUserInfo(userCredential))
            })
            .catch((error) => {
                console.log(error)
            });
    }

    function logout() {
       getAuth(app).signOut().then(() => setIsLoggedIn(false))
    }

  return (
    <div className="App">
        {
            isLoggedIn ?
                <>
                    <p>You are logged</p>
                    <button onClick={() => logout()}>Logout</button>
                </>
                :
                <>
                    <p>Login</p>
                    <input type="email" autoComplete placeholder="email"  onChange={(event) => setEmail(event.currentTarget.value)}/>
                    <input type="password" placeholder="password" onChange={(event)=> setPassword(event.currentTarget.value)}/>
                    <button onClick={() => loginWithEmailAndPassword()}>Login</button>
                    <button onClick={() => loginWithGithub()}>Github</button>
                </>
        }
    </div>
  );
}

export default App;
