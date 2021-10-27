import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig.local";
import { Link, useHistory } from "react-router-dom";
import FormBox from "./FormBox";
import Button from "./Button";
import "./Login.css";

function Login() {
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // console.log("sign in");
        // console.log(user);
        history.push("/checkstatus");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("ログインに失敗しました");
      });
  };

  return (
    <div className="login-style">
      <h1>開発を見守る</h1>
      <form onSubmit={handleSubmit}>
        <FormBox name="team" type="text" placeholder="チーム名" />
        <FormBox name="email" type="email" placeholder="メールアドレス" />
        <FormBox name="password" type="password" placeholder="パスワード" />
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
