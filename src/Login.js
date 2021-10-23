import React from "react";
import FormBox from "./FormBox";
import Button from "./Button";
import "./Login.css";

function Login() {
  return (
    <div className="login-style">
      <h1>開発を見守る</h1>
      <form>
        <FormBox name="team" type="text" placeholder="チーム名" />
        <FormBox name="email" type="email" placeholder="メールアドレス" />
        <FormBox name="password" type="password" placeholder="パスワード" />
        <Button
          title="ログイン"
          button_size="medium-size"
          text_color="text-white"
          bg_color="bg-green"
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

export default Login;
