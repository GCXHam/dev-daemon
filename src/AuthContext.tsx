import {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
import { DevDaemonDBController } from "./DevDaemonDBController";

interface AuthContextValue {
  user: User | null;
  team_name: string;
  setTeamName: Dispatch<SetStateAction<string>>;
  db_ctrler: DevDaemonDBController | undefined;
}

const AUTH_CONTEXT_DEFAULT_VALUE: AuthContextValue = {
  user: null,
  team_name: "",
  setTeamName: (value: SetStateAction<string>) => {
    value;
  }, // dummy function
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
  const [team_name, setTeamName] = useState<string>("");
  const [db_ctrler, setDBCtrler] = useState<DevDaemonDBController>();

  const value = {
    user,
    team_name,
    setTeamName,
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
