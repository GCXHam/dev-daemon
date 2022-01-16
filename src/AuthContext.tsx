import {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
import { DevDaemonDBController } from "./DevDaemonDBController";

interface AuthContextValue {
  app: FirebaseApp;
  user: User | null;
  db_ctrler: DevDaemonDBController | undefined;
  setDBCtrler: Dispatch<SetStateAction<DevDaemonDBController | undefined>>;
}

const AUTH_CONTEXT_DEFAULT_VALUE: AuthContextValue = {
  app: initializeApp(firebaseConfig),
  user: null,
  db_ctrler: undefined,
  setDBCtrler: (value: SetStateAction<DevDaemonDBController | undefined>) => {
    value;
  }, // dummy function
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
  const app = initializeApp(firebaseConfig);
  const [user, setUser] = useState<User | null>(null);
  const [db_ctrler, setDBCtrler] = useState<DevDaemonDBController | undefined>(
    new DevDaemonDBController(app)
  );

  // TODO: useAuthContext内のuserをdb_ctrlerに統合する
  const value = {
    app,
    user,
    db_ctrler,
    setDBCtrler,
  };

  useEffect(() => {
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
