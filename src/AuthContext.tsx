import { createContext, useState, useContext, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
import { DevDaemonDBController } from "./DevDaemonDBController";

interface AuthContextValue {
  user: User | undefined,
  db_ctrler: DevDaemonDBController | undefined,
}

const AUTH_CONTEXT_DEFAULT_VALUE: AuthContextValue = {
  user: undefined,
  db_ctrler: undefined
};

const AuthContext = createContext(AUTH_CONTEXT_DEFAULT_VALUE);

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: JSX.Element }): JSX.Element {
  const [user, setUser] = useState<User>();
  const [db_ctrler, setDBCtrler] = useState<DevDaemonDBController>();

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
