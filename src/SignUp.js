import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { DevDaemonDBController } from "./DevDaemonDBController.ts";
import { firebaseConfig } from "./FirebaseConfig";
import { useAuthContext } from "./AuthContext";
import { useHistory } from "react-router-dom";
import FormBox from "./FormBox";
import Button from "./Button";
import "./SignUp.css";

function SignUp() {
  let { db_ctrler } = useAuthContext();
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const { user, email, password } = event.target.elements;
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    /* eslint-disable @typescript-eslint/no-unused-vars */
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        db_ctrler = new DevDaemonDBController(app);
        const user_info = userCredential.user;

        console.log("Signed in");
        // console.log(user);
        db_ctrler.createNewMasterUserData(user_info.uid, {
          defaultDisplayName: user.value,
          defaultIconURL: "http://www.w3.org/2000/svg",
          lastUpdate: new Date(),
        });
        history.push("/checkstatus");
      })
      .catch((error) => {
        alert("アカウントを作れませんでした");
        // console.log("Sign up error");
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
    /* eslint-enable @typescript-eslint/no-unused-vars */
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
