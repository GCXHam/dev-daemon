import { createContext, useState, useContext, useEffect, Provider } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
import { DevDaemonDBController } from "./DevDaemonDBController";

const AuthContext = createContext({});

export function useAuthContext(): any {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: JSX.Element }): JSX.Element {
  const [user, setUser] = useState<User>();
  let db_ctrler = "";

  const value = {
    user,
    db_ctrler,
  };

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
        // console.log(user);
        setUser(user);
      } else {
        // User is signed out
      }
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
