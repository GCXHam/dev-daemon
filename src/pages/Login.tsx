import React, { FormEvent, FormEventHandler, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../FirebaseConfig";
import { useAuthContext } from "../AuthContext";
import { Link, useHistory } from "react-router-dom";
import FormBox from "../components/FormBox";
import Button from "../components/Button";
import "./Login.css";

function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setTeamName } = useAuthContext();

  const history = useHistory();
  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        history.push("/checkstatus");
      })
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
