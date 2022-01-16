import React, { FormEvent, FormEventHandler, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { DevDaemonDBController } from "../DevDaemonDBController";
import { useAuthContext } from "../AuthContext";
import { Link, useHistory } from "react-router-dom";
import FormBox from "../components/FormBox";
import Button from "../components/Button";
import "./Login.css";

function Login(): JSX.Element {
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { app, setDBCtrler } = useAuthContext();
  const history = useHistory();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const auth = getAuth(app);

    const defaultSignInTransaction = async (userCredential: UserCredential) => {
      // Signed in
      const user_info = userCredential.user;

      const db_ctrler = new DevDaemonDBController(app);
      await db_ctrler.setUserID(user_info.uid);
      await db_ctrler.setTeamID(teamName);
      const joining_teams = await db_ctrler.getJoiningTeamList();
      setDBCtrler(db_ctrler);

      if (joining_teams.find((team) => db_ctrler.teamID === team.path.id)) {
        history.push("/checkstatus");
      } else {
        // チームに所属していない -> エラーを表示してログイン画面に留まる
        alert("ログインに失敗しました（このチームに所属していません）");
        history.push("/");
      }
    };

    signInWithEmailAndPassword(auth, email, password)
      .then(defaultSignInTransaction)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`ログインに失敗しました (Code:${errorCode})\n${errorMessage}`);
      });
  };

  return (
    <div className="login-style">
      <h1>開発を見守る</h1>
      <form onSubmit={handleSubmit}>
        <FormBox
          name="team"
          type="text"
          placeholder="チーム名"
          onChange={setTeamName}
        />
        <FormBox
          name="email"
          type="email"
          placeholder="メールアドレス"
          onChange={setEmail}
        />
        <FormBox
          name="password"
          type="password"
          placeholder="パスワード"
          onChange={setPassword}
        />
        <Button
          title="ログイン"
          button_size="medium-size"
          text_color="text-white"
          bg_color="bg-green"
        />
        <Link to={"/signup"} className="create-account">
          アカウントを作成する
        </Link>
      </form>
    </div>
  );
}

export default Login;
