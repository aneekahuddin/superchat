import React, {useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyAa4IeB-YHpw8i9ch6joEscrUFT6XpQ2EI",
    authDomain: "superchat-504cc.firebaseapp.com",
    projectId: "superchat-504cc",
    storageBucket: "superchat-504cc.appspot.com",
    messagingSenderId: "489779059475",
    appId: "1:489779059475:web:b27b48f12512caffc358e6",
    measurementId: "G-E5NEEGSZQV"

})
const auth = firebase.auth();
const firestore = firebase.firestore();
 

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick = {signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key= {msg.id} message= {msg}/>)}
      <span ref={dummy}></span>
    </main>
    <form onSubmit= {sendMessage}>
        <input value = {formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text,uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <>
    <div className = {`message ${messageClass}`}> 
    <img src={photoURL}/>
    <p>{text}</p>
    </div>
    </>
  )
}


export default App;
