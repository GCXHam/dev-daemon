# スタイルガイド

## ファイル構成

* ファイル名は原則，`UpperCamelCase`で定義する．
* ページそのものを構成するファイルは，`pages`に保存する．
* コンポーネントは，`components`に保存する．
* テストファイルは，`__tests__`に保存する．

## コーディング規約

### 全体

* `TypeScript`で記述する．
* 基本的な構文チェックは，`yarn lint`，`yarn prettier`を行ない，コードの統一性を図る．

### 命名

* 変数は，`名詞形`で，`snake_case`で表記する．
* 関数名は，`動詞(+目的語＋修飾語)`で，`lowerCamelCase`で表記する．
* クラス名は，`名詞形`で，`UpperCamelCase`で表記する．
  * メンバー変数は，先頭に`アンダースコア_`を付与する．
* インターフェイスは，`名詞形`で，`UpperCamelCase`で表記する．
* 定数は，`名詞形`で，大文字の`SNAKE_CASE`で表記する．

  ※例外
  * useStateの変数は，`lowerCamelCase`で表記する．
  * 関数コンポーネントは，`UpperCamelCase`で表記する．

```typescript

/* 変数 */
const ret_arr: UserDataInTeam[] = [];

/* 関数 */
public async getUsersDataInTeam()

/* クラス */
export class DevDaemonDBController {
  private db: Firestore;

  private _user_id = "";

  private _team_id = "";

  private getUserDataInTeamRef(
    team_id: string,
    user_id: string
  ): DocumentReference<UserDataInTeam> {
    return doc(this.db, "/teams/" + team_id + "/users", user_id).withConverter(
      user_data_in_team_converter
    );
  }
}

/* インターフェース */
export interface MasterUserData {

  defaultDisplayName: string;

  defaultIconURL: string;

  lastUpdate?: Date;
}

/* 定数 */
export const STATE_LEAVING = "leaving";

/* useState */
const [userName, setUserName] = useState("");

/* 関数コンポーネント */
function SignUp(): JSX.Element {
  const h1_tag = <h1>GCXHam</h1>;

  return (<>h1_tag</>);
}
```
