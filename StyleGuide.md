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

### コメント

* 一行も複数行も`//`で記述する．
* アノテーションコメントをつけたときは，基本，`別のisuue`も立てる．
  * あとで対応するときは，`TODO: 説明`とする．
  * 既知の不具合には，`FIXME: 説明`とする．
  * 緊急性の高いものは`大文字`にする．

### アロー関数

* 2項以上ある場合は`括弧()`をつけ, 単項の場合はつけない．
* 関数の中身が`1行`からなるときは，`returnをつけない`．

```typescript
const func1 = (a => a);
const func2 = (a => (a * a));
const func3 = ((a, b) => (a / b));

const func4 = ((a, b) => {
  const offset = 10;
  return a + b + offset;
});
```

### 非同期処理

単一の非同期実行結果のみを用いるのであれば`then`, 複数の文からなる非同期実行結果を用いるのであれば`async-await`を使用する．

```typescript
/* thenを使用 */
db_ctrler?.getUsersDataInTeam()?.then(setUsersData);

/* async-awaitを使用 */
public async setUserID(id: string): Promise<void> {
  const data_ref = this.getUserDataMasterRef(id);

  const docSnap = await getDoc(data_ref).catch((e) => {
    console.error("Error has occured : ", e);
    throw e;
  });

  this.user_data_cache = docSnap.data();
}
```

### 関数コンポーネントの分割単位

`10行以上`の関数コンポーネントは別ファイルに分割する．
それ以外は，カプセル化せずに直書きをする．

## コミットメッセージ規約

### 共通事項

* 言語は，原則`日本語`とする．
* 構成は，`タイトル一行`+`空行`+`詳細`とする．
* 1文は`72文字以下`とする．
* 時制は`現在形`
* 語尾は`体言止め`でもよい．
* `句点(。)`や`コロン`は書かない．

### タイトル

* コミットのタイプを記す．
  * **feat**: 新機能の開発
  * **fix**: バグの修正
  * **docs**: ドキュメントの加筆・修正 (生成は`chore`)
  * **style**: インデント，空白の修正 (ソースコードの`意味は変えない`)
  * **perf**: パフォーマンス改善
  * **test**: テストコードの追加・修正
  * **chore**: パッケージの追加・ドキュメントの作成やその他

* 修正したファイル名を記述する.
* 複数ある場合は`*`を用いる．

```markdown
[例]
feat(Login.tsx): db_ctrlerを任意のコンポーネントで共有可能

feat(*): JSコードのTS化
```

### 詳細

* 今後確認をとれるように，修正点・注意点を記述する．
* `Markdown記法`を用いてもよい．
