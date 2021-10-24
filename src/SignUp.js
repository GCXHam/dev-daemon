import React from "react";
import FormBox from "./FormBox";
import Button from "./Button";
import "./SignUp.css";

function SignUp() {
  return (
    <div className="signup-style">
      <h4>アカウント作成</h4>
      <form>
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
