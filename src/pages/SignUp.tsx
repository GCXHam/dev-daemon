import React, { FormEvent, FormEventHandler, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { DevDaemonDBController } from "../DevDaemonDBController";
import { firebaseConfig } from "../FirebaseConfig";
import { useAuthContext } from "../AuthContext";
import { useHistory } from "react-router-dom";
import FormBox from "../components/FormBox";
import Button from "../components/Button";
import "./SignUp.css";

function SignUp(): JSX.Element {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let { db_ctrler } = useAuthContext();

  const history = useHistory();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const defaultSignUpTransaction = (userCredential: UserCredential) => {
      // Signed in
      db_ctrler = new DevDaemonDBController(app);
      const user_info = userCredential.user;

      db_ctrler.createNewMasterUserData(user_info.uid, {
        defaultDisplayName: userName,
        defaultIconURL: "http://www.w3.org/2000/svg",
        lastUpdate: new Date(),
      });
      history.push("/checkstatus");
    };

    createUserWithEmailAndPassword(auth, email, password)
      .then(defaultSignUpTransaction)
      .catch((error) => {
        alert(
          `アカウントを作れませんでした (Code:${error.code})\n${error.message}`
        );
      });
  };

  return (
    <div className="signup-style">
      <h4>アカウント作成</h4>
      <form onSubmit={handleSubmit}>
        <FormBox
          name="user"
          type="text"
          placeholder="ユーザー名"
          onChange={setUserName}
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
