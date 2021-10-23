import { FirebaseApp } from "firebase/app";
import {
  getFirestore,
  onSnapshot,
  collection,
  doc,
  updateDoc,
  Firestore,
  DocumentReference,
  getDoc,
  getDocs,
  Unsubscribe,
  FirestoreDataConverter,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

//#region  interfaces
/** チームに記録される各ユーザのデータの型 */
export interface UserDataInTeam {
  /** 関連付けられたユーザへのパス */
  path: DocumentReference<MasterUserData>;

  /** 表示名 */
  displayName: string;

  /** 管理者かどうか */
  isAdmin: boolean;

  /** ユーザの状態(Working/Leavingなど) */
  state: string;

  /** 最終更新時間 (readonly) */
  lastUpdate?: Date;
}

/** マスタユーザデータに記録されるチームのデータの型 */
export interface TeamDataInUser {
  /** 関連付けられたチームへのパス */
  path: DocumentReference<TeamData>;

  /** メモ用の領域 */
  memo: string;

  /** 参加日 */
  joinDate: Date;
}

/** マスタユーザデータの型 */
export interface MasterUserData {
  /** デフォルトの表示名 (チーム選択画面等で表示?) */
  defaultDisplayName: string;

  /** デフォルトのアイコンURL*/
  defaultIconURL: string;

  /** データの最終更新日時 */
  lastUpdate?: Date;
}

/** チームデータの型 */
export interface TeamData {
  /** 表示名 */
  displayName: string;

  /** メモ用の領域 */
  memo: string;

  /** チームの作成日 */
  createDate: Date;

  /** チームに記録されたデータの最終更新日時 */
  lastUpdate?: Date;
}

//#region Converters
const user_data_in_team_converter: FirestoreDataConverter<UserDataInTeam> = {
  toFirestore: (jsData) => {
    return {
      Path: jsData.path,
      DisplayName: jsData.displayName,
      IsAdmin: jsData.isAdmin,
      State: jsData.state,
      LastUpdate: jsData.lastUpdate ?? new Date(),
    };
  },

  fromFirestore: (snapshot, opts) => {
    const data = snapshot.data(opts);
    return {
      path: data.Path,
      displayName: data.DisplayName,
      isAdmin: data.IsAdmin,
      state: data.IsState,
      lastUpdate: data.LastUpdate,
    };
  },
};

const team_data_in_user_converter: FirestoreDataConverter<TeamDataInUser> = {
  toFirestore: (js) => {
    return {
      Path: js.path,
      Memo: js.memo,
      JoinDate: js.joinDate,
    };
  },

  fromFirestore: (snapshot, opts) => {
    const data = snapshot.data(opts);
    return {
      path: data.Path,
      memo: data.Memo,
      joinDate: data.JoinDate,
    };
  },
};

const master_user_data_converter: FirestoreDataConverter<MasterUserData> = {
  toFirestore: (js) => {
    return {
      DefaultDisplayName: js.defaultDisplayName,
      DefaultIconURL: js.defaultIconURL,
      LastUpdate: js.lastUpdate ?? new Date(),
    };
  },

  fromFirestore: (snapshot) => {
    const data = snapshot.data();

    return {
      defaultDisplayName: data.DefaultDisplayName,
      defaultIconURL: data.DefaultIconURL,
      lastUpdate: data.LastUpdate,
    };
  },
};

const team_data_converter: FirestoreDataConverter<TeamData> = {
  toFirestore: (js) => {
    return {
      DisplayName: js.displayName,
      Memo: js.memo,
      CreateDate: js.createDate,
      LastUpdate: js.lastUpdate ?? new Date(),
    };
  },

  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      displayName: data.DisplayName,
      memo: data.Memo,
      createDate: data.CreateDate,
      lastUpdate: data.LastUpdate,
    };
  },
};
//#endregion
//#endregion

export const STATE_LEAVING = "leaving";
export const STATE_WORKING = "working";

/** dev-daemonのDBを統括する */
export class DevDaemonDBController {
  //#region private fields
  /** Firestoreのインターフェイス */
  private db: Firestore;

  /** ユーザIDのキャッシュ */
  private _user_id = "";

  /** マスタユーザデータのキャッシュ */
  private user_data_cache?: MasterUserData = undefined;

  /** チームIDのキャッシュ */
  private _team_id = "";

  /** チームに所属するユーザの情報(State等)の変更通知購読を解除する関数 */
  private unsubscribe_team_data?: Unsubscribe = undefined;

  /** DB内において現在のユーザの情報が記録された位置 */
  private user_data_master_ref?: DocumentReference<MasterUserData> = undefined;

  /** DB内において, 現在のチーム情報が記録された位置 */
  private team_data_ref?: DocumentReference<TeamData> = undefined;

  /** DB内において, 現在表示中のチームに記録された自身の情報が記録された位置 */
  private user_data_in_team_ref?: DocumentReference<UserDataInTeam> = undefined;
  //#endregion

  //#region Ref getters
  /** DocumentReference<MasterUserData>を取得する */
  private getUserDataMasterRef(id: string): DocumentReference<MasterUserData> {
    return doc(this.db, "/users", id).withConverter(master_user_data_converter);
  }

  /** DocumentReference<TeamData>を取得する */
  private getTeamDataRef(id: string): DocumentReference<TeamData> {
    return doc(this.db, "/teams", id).withConverter(team_data_converter);
  }

  /** DocumentReference<UserDataInTeam>を取得する */
  private getUserDataInTeamRef(
    team_id: string,
    user_id: string
  ): DocumentReference<UserDataInTeam> {
    return doc(this.db, "/teams", team_id, "users", user_id).withConverter(
      user_data_in_team_converter
    );
  }

  /** DocumentReference<TeamDataInUser>を取得する */
  private getTeamDataInUserRef(
    team_id: string,
    user_id: string
  ): DocumentReference<TeamDataInUser> {
    return doc(this.db, "/users", user_id, "teams", team_id).withConverter(
      team_data_in_user_converter
    );
  }
  //#endregion

  /** DevDaemonDBControllerインスタンスを初期化する */
  constructor(app: FirebaseApp) {
    this.db = getFirestore(app);
  }

  //#region Property: userID
  /** ログイン中のユーザのID */
  public get userID(): string {
    return this._user_id;
  }
  /** ログイン中のユーザのID */
  public set userID(id: string) {
    const data_ref = this.getUserDataMasterRef(id);
    getDoc(data_ref)
      .then((docSnap) => {
        if (!docSnap.exists()) {
          const msg = "userID : " + id + " was not found.";
          console.error(msg);
          throw new Error(msg);
        }

        this._user_id = id;
        this.user_data_master_ref = data_ref;

        this.user_data_cache = docSnap.data();
      })
      .catch((e) => {
        console.error("Error has occured : ", e);
        throw e;
      });
  }
  //#endregion

  //#region  Property: teamID
  /** 現在使用中のチームのID */
  public get teamID(): string {
    return this._team_id;
  }
  /** 現在使用中のチームのID */
  public set teamID(id: string) {
    const data_ref = this.getTeamDataRef(id);

    getDoc(data_ref)
      .then((docSnap) => {
        //指定のteamIDが存在していたかチェック
        if (!docSnap.exists()) {
          const msg = "teamID : " + id + " was not found.";
          console.error(msg);
          throw new Error(msg);
        }

        //Team内にUserがいるかどうか判定 => いなかったら失敗

        //既に購読していたら, 一度購読解除する
        if (this.unsubscribe_team_data != null) this.unsubscribe_team_data();

        //teamIDを更新
        this._team_id = id;

        //参照設定を更新
        this.team_data_ref = data_ref;
        this.user_data_in_team_ref = this.getUserDataInTeamRef(id, this.userID);

        //グループに所属する各員のデータ変更をSubscribe
        this.unsubscribe_team_data = onSnapshot(
          collection(this.db, data_ref.path, "users"),
          (doc) => {
            const states: { [name: string]: string } = {};

            //各員のStateを取得
            doc.forEach((d) => {
              const data = d.data();
              if (data?.State != null && data?.DisplayName != null)
                states[data.DisplayName] = data.State;
            });

            //DEBUG
            console.debug("Current data: ", states);
          }
        );
      })
      .catch((e) => {
        console.error("Error has occured : ", e);
        throw e;
      });
  }
  //#endregion

  /** 自身が所属するチームのリストを取得する */
  public getJoiningTeamList(): TeamDataInUser[] {
    if (this.user_data_master_ref == null) throw new Error("UserID is not set");

    const data_ref = collection(
      this.db,
      this.user_data_master_ref?.path,
      "teams"
    ).withConverter(team_data_in_user_converter);

    const ret_arr: TeamDataInUser[] = [];

    getDocs(data_ref).then((values) =>
      values.forEach((doc) => ret_arr.push(doc.data()))
    );

    return ret_arr;
  }

  //#region  Property: myState
  /** 自身の状態 (Working/Leavingなど) */
  public async getMyState(): Promise<string> {
    if (this.user_data_in_team_ref == null)
      throw new Error("TeamID is not set");

    return (await getDoc(this.user_data_in_team_ref)).data()?.state ?? "";
  }
  /** 自身の状態 (Working/Leavingなど) */
  public set myState(value: string) {
    if (this.team_data_ref == null || this.user_data_in_team_ref == null)
      throw new Error("TeamID is not set");

    updateDoc(this.user_data_in_team_ref, {
      state: value,
      lastUpdate: new Date(),
    });
    updateDoc(this.team_data_ref, { lastUpdate: new Date() });
  }
  //#endregion

  /** 新しいチームを作成する */
  public async createNewTeam(team_id: string, config: TeamData) {
    if (await this.isTeamIDAlreadyExists(team_id))
      throw new Error("TeamID (" + team_id + ") is already exist.");

    const newTeamDataRef = this.getTeamDataRef(team_id);
    const userDataInNewTeamRef = this.getUserDataInTeamRef(
      team_id,
      this.userID
    );
    setDoc(newTeamDataRef, config);
    /*setDoc(userDataInNewTeamRef, {
      path: this.user_data_master_ref?.path ?? "",
      displayName: this.user_data_cache?.defaultDisplayName ?? this.userID,
      isAdmin: true,
      state: "Working",
      lastUpdate: new Date()
    });*/
    this.addMemberToTeam(team_id, this.userID, true);

    this.team_data_ref = newTeamDataRef;
    this.user_data_in_team_ref = userDataInNewTeamRef;
  }

  /** 現在表示しているチームを削除する (管理者のみ) */
  public async deleteCurrentTeam(delete_even_if_not_admin = false) {
    if (this.userID == "") throw new Error("UserID was not set");
    if (this.teamID == "" || this.team_data_ref == null)
      throw new Error("Team not selected");

    this.user_data_in_team_ref ??= this.getUserDataInTeamRef(
      this.teamID,
      this.userID
    );

    //ユーザがTeamに所属しているかを確認 => 所属していなければ削除できない
    const userDataInTeam = await getDoc(this.user_data_in_team_ref);
    if (!userDataInTeam.exists())
      throw new Error("Team or User was not found on the database");

    //「ユーザではなかったとしても削除する」オプションが指定されていない場合,
    //当該Teamの管理者以外はチームを削除できない
    if (!delete_even_if_not_admin && !userDataInTeam.data().isAdmin)
      throw new Error("Permission Denied");

    //チームのメンバーデータ変更検知イベントを購読しているなら, 購読解除する
    if (this.unsubscribe_team_data != null) {
      this.unsubscribe_team_data();
      this.unsubscribe_team_data = undefined;
    }

    //Teamに所属するメンバーデータ(document)をすべて削除する = collectionを削除する
    getDocs(
      collection(this.db, this.team_data_ref.path, "users").withConverter(
        user_data_in_team_converter
      )
    ).then((values) =>
      values.forEach((v) => {
        //ユーザに関連付けられたチーム参加情報を削除する
        deleteDoc(v.data().path);

        //メンバー情報を削除する
        deleteDoc(v.ref);
      })
    );

    //Teamデータ(document)を削除する
    deleteDoc(this.team_data_ref).then(() => {
      this.team_data_ref = undefined;
      this.user_data_in_team_ref = undefined;
      this._team_id = "";
    });

    //削除完了
  }

  /** 指定の (OR 現在表示している) チームに指定のユーザを追加する */
  public async addMemberToTeam(
    user_id: string,
    team_id?: string,
    isAdmin = false
  ) {
    //デフォルトは現在表示しているチーム
    team_id ??= this.teamID;

    //引数のバリデーション
    if (team_id == null) throw new Error("Team ID was not set");
    if (user_id == null) throw new Error("User ID was not set");

    //IDがデータベースに存在するか確認
    const user_id_ref = this.getUserDataMasterRef(user_id);
    if (!(await this.isDocumentAlreadyExists(user_id_ref)))
      throw new Error("UserID was not found in the DB");
    if (!(await this.isTeamIDAlreadyExists(team_id)))
      throw new Error("TeamID was not found in the DB");

    //ユーザが既にチームに所属していないかを確認
    const userInTeamRef = this.getUserDataInTeamRef(team_id, user_id);
    if (await this.isDocumentAlreadyExists(userInTeamRef))
      throw new Error("User is already in the Team");

    //ユーザデータのマスタデータを取得する
    const user_data_master = (
      await getDoc(this.getUserDataMasterRef(user_id))
    ).data();

    //ユーザをチームに追加する
    setDoc(userInTeamRef, {
      path: user_id_ref,
      displayName: user_data_master?.defaultDisplayName ?? user_id,
      isAdmin: isAdmin,
      state: STATE_LEAVING,
      lastUpdate: new Date(),
    });

    //ユーザのマスタデータに「チームに参加した」ことを追加する
    setDoc(this.getTeamDataInUserRef(team_id, user_id), {
      path: this.getTeamDataRef(team_id),
      memo: "",
      joinDate: new Date(),
    });
  }
  /** 現在表示しているチームから指定のユーザを削除する */
  public async removeMemberFromCurrentTeam(user_id?: string) {
    if (this.userID == null) throw new Error("Controller UserID not set");
    if (this.teamID == null || this.team_data_ref == null)
      throw new Error("TeamID not set");

    //デフォルトでは自身を削除する
    user_id ??= this.userID;

    //自身を削除するわけではないのであれば, 管理者権限が必要
    if (user_id != this.userID)
      if (
        !(
          await getDoc(
            this.user_data_in_team_ref ??
              this.getUserDataInTeamRef(this.teamID, this.userID)
          )
        ).data()?.isAdmin
      )
        throw new Error("Permission Denied");

    //最後の一人であれば「チームの削除」を行う
    const users_arr = await getDocs(
      collection(this.db, this.team_data_ref.path, "users").withConverter(
        user_data_in_team_converter
      )
    );
    if (users_arr.docs.length <= 0) {
      this.deleteCurrentTeam();
      return;
    }

    //チームに記録された「ユーザの情報」を削除する
    deleteDoc(this.getUserDataInTeamRef(this.teamID, user_id));
    //ユーザに記録された「所属チームの情報」を削除する
    deleteDoc(this.getTeamDataInUserRef(this.teamID, user_id));
  }

  public async isDocumentAlreadyExists<T>(
    doc_ref: DocumentReference<T>
  ): Promise<boolean> {
    return (await getDoc(doc_ref)).exists();
  }

  /** 指定のユーザIDが既に作成済みかどうかを確認する */
  public isUserIDAlreadyExists(user_id: string): Promise<boolean> {
    return this.isDocumentAlreadyExists(this.getUserDataMasterRef(user_id));
  }

  /** 指定のチームIDが既に作成済みかどうかを確認する */
  public isTeamIDAlreadyExists(team_id: string): Promise<boolean> {
    return this.isDocumentAlreadyExists(this.getTeamDataRef(team_id));
  }

  public isUserAlreadyInTheTeam(
    team_id: string,
    user_id: string
  ): Promise<boolean> {
    return this.isDocumentAlreadyExists(
      this.getUserDataInTeamRef(team_id, user_id)
    );
  }

  /** ユーザデータを新規作成する */
  public async createNewMasterUserData(
    user_id: string,
    user_data: MasterUserData
  ) {
    if (await this.isUserIDAlreadyExists(user_id))
      throw new Error("UserID already exists");

    const doc_ref = this.getUserDataMasterRef(user_id);
    await setDoc(doc_ref, user_data);
    //この関数でUserIDのセットは行わない
  }
}
