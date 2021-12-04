import { DevDaemonDBController } from "../DevDaemonDBController";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../FirebaseConfig";

const app = initializeApp(firebaseConfig);

const userNum = new Date().getTime();

const TIMEOUT = 20 * 1000;

test(
  "create new user test",
  async () => {
    const UserID = "TestUser" + userNum;
    const masterUserData = {
      defaultDisplayName: "DDN" + userNum,
      defaultIconURL: "https://avatars.githubusercontent.com/u/31824852",
      lastUpdate: new Date(),
    };

    const ctrler = new DevDaemonDBController(app);

    await ctrler.createNewMasterUserData(UserID, masterUserData);
    await ctrler.setUserID(UserID);

    expect(await ctrler.isUserIDAlreadyExists(UserID)).toBe(true);
  },
  TIMEOUT
);
