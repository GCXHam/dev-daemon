import { DevDaemonDBController } from "../DevDaemonDBController";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../FirebaseConfig";

const app = initializeApp(firebaseConfig);

const userNum = new Date().getTime();
const TeamID = "TestTeam" + userNum;
const sampleTeamData = {
  displayName: "DN" + userNum,
  memo: "MEMO AREA",
  createDate: new Date(),
  lastUpdate: new Date(),
};
const UserID = "CreateTeamTestUser";

const TIMEOUT = 20 * 1000;
const ICON_URL =
  "https://pbs.twimg.com/profile_images/1265840521756372992/CibZSLs2_400x400.jpg";

test(
  "create new team test",
  async () => {
    const ctrler = new DevDaemonDBController(app);

    if ((await ctrler.isUserIDAlreadyExists(UserID)) != true) {
      ctrler.createNewMasterUserData(UserID, {
        defaultDisplayName: "DDN" + UserID,
        defaultIconURL: ICON_URL,
        lastUpdate: new Date(),
      });
    }

    await ctrler.setUserID(UserID);
    await ctrler.createNewTeam(TeamID, sampleTeamData);

    expect(await ctrler.isTeamIDAlreadyExists(TeamID)).toBe(true);
    expect(await ctrler.isUserAlreadyInTheTeam(TeamID, UserID)).toBe(true);
  },
  TIMEOUT
);

test(
  "addMemberToTeamTest",
  async () => {
    const ctrler = new DevDaemonDBController(app);
    await ctrler.setUserID(UserID);
    await ctrler.setTeamID(TeamID);

    for (let i = 0; i < 10; i++) {
      const user_id_tmp = "TestUser" + i + "ForAddMemberToTeamTest";
      if ((await ctrler.isUserIDAlreadyExists(user_id_tmp)) != true)
        await ctrler.createNewMasterUserData(user_id_tmp, {
          defaultDisplayName: "DN" + i,
          defaultIconURL: ICON_URL,
          lastUpdate: new Date(),
        });

      await ctrler.addMemberToTeam(user_id_tmp);
    }

    for (let i = 0; i < 10; i++) {
      const ctrler = new DevDaemonDBController(app);
      const user_id_tmp = "TestUser" + i + "ForAddMemberToTeamTest";

      expect(await ctrler.isUserAlreadyInTheTeam(TeamID, user_id_tmp)).toBe(
        true
      );

      await ctrler.setUserID(user_id_tmp);

      expect(
        (await ctrler.getJoiningTeamList()).filter(
          (v) => v.path.path == "teams/" + TeamID
        ).length
      ).toBe(1);
    }
  },
  TIMEOUT
);
