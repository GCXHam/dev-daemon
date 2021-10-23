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
            
            
            <div id="container">
            <section>
                <div class="box">
                <h2>マイステータス</h2>
                <p>riko</p>
                <Button title="アクティブ" button_size="small-size" text_color="text-white" text_color="bg-yellow"/>
                <Button title="離席中" button_size="small-size" text_color="text-white" text_color="bg-green"/>
                
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
                <div id="root"></div>
            
            </div>

            <div id="fixed-area">
            <img src={`${process.env.PUBLIC_URL}/img/ezgif.com-gif-maker.png`}  alt="" />
            </div>
        </div>
        </div>
    );
}

// $(window).on('load resize', function() {
//   var windowWidth = window.innerWidth;
//   var elements = $('#fixed-area');
//   if (windowWidth >= 768) {
//     Stickyfill.add(elements);
//   }else{
//     Stickyfill.remove(elements);
//   } 
// });

// APNG.ifNeeded().then(function () {
//   var images = document.querySelectorAll(".apng-image");
//   for (var i = 0; i < images.length; i++) APNG.animateImage(images[i]);
// });


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


export default CheckStatus;