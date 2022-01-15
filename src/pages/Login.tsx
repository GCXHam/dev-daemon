import React, { FormEvent, FormEventHandler, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { DevDaemonDBController } from "../DevDaemonDBController";
import { firebaseConfig } from "../FirebaseConfig";
import { useAuthContext } from "../AuthContext";
import { Link, useHistory } from "react-router-dom";
import FormBox from "../components/FormBox";
import Button from "../components/Button";
import "./Login.css";

function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /** TODO:
   * どちらもconstで宣言するようにする
   *
   * もしくは，db_ctrlerのプロパティに_team_id(private)があるので，
   * こちらを使うようにした方がいいかもしれない
   * （現時点では，setTeamIDメソッドは未完成？←TODOが残っている）
   * 同時に，useAuthContext内のuserもdb_ctrlerに統合を検討
   */
  const { team_name, setTeamName } = useAuthContext();
  let { db_ctrler } = useAuthContext();

  const history = useHistory();
  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const defaultSignInTransaction = async (userCredential: UserCredential) => {
      // Signed in
      const user_info = userCredential.user;

      /** TODO:
       * 存在しないチーム名を入力したときは，
       * 新規チームを作成する処理を挟むべきかもしれない
       */
      db_ctrler = new DevDaemonDBController(app);
      await db_ctrler.setUserID(user_info.uid);
      const joining_teams = await db_ctrler.getJoiningTeamList();
      if (joining_teams.find((team) => team_name === team.path.id)) {
        history.push("/checkstatus");
      } else {
        alert("ログインに失敗しました（存在しないチーム名です）");
        setTeamName("");
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
