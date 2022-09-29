import {AuthStack, ProfileTab} from "./components/navigators/Navigators";
import {NavigationContainer} from "@react-navigation/native";
import firebase from "firebase/compat";
import React, { useEffect, useState} from "react";
import {AppContext, StateProvider} from "./components/AppContext";


const firebaseConfig = {
    apiKey: "AIzaSyARsn7PDWBo6K1ZBdbB1YM3IBBGsLtVjFw",
    authDomain: "template-cb110.firebaseapp.com",
    projectId: "template-cb110",
    storageBucket: "template-cb110.appspot.com",
    messagingSenderId: "383377490544",
    appId: "1:383377490544:web:047a21131b08f9735d6ab5"
};




export default function App() {
  //Her oprettes bruger state variblen
  //const {globalUser, setGlobalUser } = useContext(AppContext);
  const [user, setUser] = useState({ loggedIn: false });

  //Koden sikrer at kun én Firebase initieres under brug af appen.
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  //onAuthstatechanged er en prædefineret metode, forsynet af firebase, som konstant observerer brugerens status (logget ind vs logget ud)
//Pba. brugerens status foretages et callback i form af setUSer metoden, som håndterer user-state variablens status.
  function onAuthStateChange(callback) {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        callback({loggedIn: true, user: user});
      } else {
        callback({loggedIn: false});
      }
    });
  }

  //Heri aktiverer vi vores listener i form af onAuthStateChanged, så vi dynamisk observerer om brugeren er aktiv eller ej.
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  //Her oprettes gæstekomponentsindhold, der udgøres af sign-up og login siderne
  const ValidateUser = () => {
    return (
        <NavigationContainer>
          <AuthStack/>
        </NavigationContainer>
    );
  }
    const Profile = () => {
      return (
          <NavigationContainer><ProfileTab/></NavigationContainer>
      );
    }
    return (user.loggedIn ? <StateProvider><Profile/></StateProvider> :<StateProvider><ValidateUser/></StateProvider>) ;

}
