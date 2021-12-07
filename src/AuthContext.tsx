import { createContext, useState, useContext, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
import { DevDaemonDBController } from "./DevDaemonDBController";

interface AuthContextValue {
  user: User | null;
  db_ctrler: DevDaemonDBController | undefined;
}

const AUTH_CONTEXT_DEFAULT_VALUE: AuthContextValue = {
  user: null,
  db_ctrler: undefined,
};

const AuthContext = createContext(AUTH_CONTEXT_DEFAULT_VALUE);

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}

export function AuthProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [db_ctrler, setDBCtrler] = useState<DevDaemonDBController>();

  const value = {
    user,
    db_ctrler,
  };

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      // サインイン時にはuserにユーザ情報が入り, サインアウト時にはnullが入る
      setUser(user);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
