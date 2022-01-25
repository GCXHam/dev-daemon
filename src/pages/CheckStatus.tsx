import React, { useState, useEffect } from "react";
import "./CheckStatus.css";
import Button from "../components/Button";
import MemberStatusCard from "../components/MemberStatusCard";
import { useAuthContext } from "../AuthContext";
import { UserDataInTeam } from "../DevDaemonDBController";

function CheckStatus(): JSX.Element {
  const [UsersData, setUsersData] = useState<UserDataInTeam[] | undefined>();
  const { db_ctrler } = useAuthContext();
  const user_data = db_ctrler?.userMasterData;

  // useAuthContextの影響？か"db_ctrler"は，複数回のコンポーネントの
  // 読込の末，データが格納される様子（理由は分かっていない）．
  useEffect(() => {
    const getUsersData = async () => {
      setUsersData(await db_ctrler?.getUsersDataInTeam());
    };

    getUsersData();
  }, [db_ctrler]);

  return (
    <div>
      <header>
        <h1>開発を見守る</h1>
        <nav id="right">
          <Button
            title="ログアウト"
            button_size="medium-size"
            text_color="text-white"
            bg_color="bg-green"
          />
        </nav>
      </header>
      <div id="wrapper">
        {/* 左画面のステータス確認表示 */}
        <div id="container">
          <section>
            <div className="box">
              <h2>マイステータス</h2>
              <p>{user_data?.defaultDisplayName}</p>
              <div className="left">
                <Button
                  title="アクティブ"
                  button_size="small-size"
                  text_color="text-dark"
                  bg_color="bg-yellow"
                />
                <Button
                  title="離席中"
                  button_size="small-size"
                  text_color="text-white"
                  bg_color="bg-green"
                />
              </div>
            </div>
            <div className="box">
              <h2>{`チーム名: ${db_ctrler?.teamID}`}</h2>
              <ul>
                {/* TODO: UsersDataに対して，filterメソッドを使用して自身のステータスは表示しないようにする */}
                {UsersData?.map((info, index) => (
                  <MemberStatusCard
                    key={index}
                    name={info?.displayName}
                    status={info?.state}
                  />
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* 右画面のハムスター表示 */}
        <div id="fixed-area">
          <img src={`${process.env.PUBLIC_URL}/img/hamster-image.png`} alt="" />
        </div>
      </div>
    </div>
  );
}

export default CheckStatus;
