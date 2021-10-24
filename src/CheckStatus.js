import React from "react";
import "./CheckStatus.css";
import Button from "./Button";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

function CheckStatus() {
  return (
    // TODO: if `react-router-dom` is installed, insert `Link` tag.
    <div>
      <header>
        <h1>開発を見守る</h1>
      </header>
      <div id="wrapper">
        {/* 左画面のステータス確認表示 */}
        <div id="container">
          <section>
            <div class="box">
              <h2>マイステータス</h2>
              <p>riko</p>
              <div class="left">
                <Button
                  title="アクティブ"
                  button_size="small-size"
                  text_color="text-white"
                  text_color="bg-yellow"
                />
                <Button
                  title="離席中"
                  button_size="small-size"
                  text_color="text-white"
                  text_color="bg-green"
                />
              </div>
            </div>
            <div class="box">
              <h2>チーム名：</h2>
              <ul>
                <li>小松</li>
                <li>藤田</li>
                <li>新城</li>
              </ul>
            </div>
          </section>
        </div>

        {/* 右画面のハムスター表示 */}
        <div id="fixed-area">
          <img
            src={`${process.env.PUBLIC_URL}/img/ezgif.com-gif-maker.png`}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default CheckStatus;
