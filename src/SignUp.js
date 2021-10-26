import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "./FirebaseConfig";
import { useHistory } from "react-router-dom";
import FormBox from "./FormBox";
import Button from "./Button";
import "./SignUp.css";

function SignUp() {
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        console.log("Signed in");
        // console.log(user);
        history.push("/checkstatus");
      })
      .catch((error) => {
        alert("アカウントを作れませんでした");
        // console.log("Sign up error");
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
  };

  return (
    <div className="signup-style">
      <h4>アカウント作成</h4>
      <form onSubmit={handleSubmit}>
        <FormBox name="user" type="text" placeholder="ユーザー名" />
        <FormBox name="email" type="email" placeholder="メールアドレス" />
        <FormBox name="password" type="password" placeholder="パスワード" />
        <Button
          title="新規チーム作成"
          button_size="medium-size"
          text_color="text-dark"
          bg_color="bg-yellow"
        />
      </form>
    </div>
  );
}

export default SignUp;
