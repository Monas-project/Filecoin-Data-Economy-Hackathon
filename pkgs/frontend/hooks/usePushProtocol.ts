import { getEnv } from "@/utils/getEnv";
import { ListInfo } from "@/utils/type";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from "ethers";

/**
 * createSigner for PushProtocol
 */
const createSignerForPushProtocol = async () => {
  // get env
  const env = await getEnv();
  // create signer & provider object
  const signer = new ethers.Wallet(env.PUSH_PROTOCOL_PRIVATE_KEY);
  const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);
  // connect
  await signer.connect(provider);
  return signer;
};

/**
 * init PushSDK
 * @param signer pushprotocol's signer
 */
const initPushSDK = async (signer: any) => {
  const pushUser = await PushAPI.initialize(signer, {
    env: ENV.STAGING,
  });
  return pushUser;
};

/**
 * get PushInfo
 * @param signer connected account's signer
 */
export const getPushInfo = async (signer: any) => {
  // init PushSDK
  const pushUser = await initPushSDK(signer);
  // get profile Info
  // const response = await pushUser.profile.info();
  // get subscriptions
  // const subscriptions = await pushUser.notification.subscriptions();
  // get channel info
  // const channelInfo = await pushUser.channel.info(CANNEL_ADDRESS);
  // console.log("response:", response);

  // console.log("subscriptions:", subscriptions);
  // console.log("channelInfo:", channelInfo);

  const result: ListInfo[] = [];
  // get notification info
  const listInfo: ListInfo[] = await pushUser.notification.list("SPAM");
  console.log("listInfo:", listInfo);
  const listInfo2: ListInfo[] = await pushUser.notification.list("INBOX");
  console.log("listInfo2:", listInfo2);

  // SPAMとINBOXの中身を詰める
  for (let i = 0; i < listInfo.length; i++) {
    result.push(listInfo[i]);
  }
  for (let i = 0; i < listInfo2.length; i++) {
    result.push(listInfo2[i]);
  }

  return result;
};

/**
 * send Notification
 */
export const sendNotification = async (
  to: string,
  cid: any,
  key: any,
  fileInfo: any
) => {
  // init PushSDK
  const signer = await createSignerForPushProtocol();
  const pushUser = await initPushSDK(signer);
  // send notification
  const sendNotifRes = await pushUser.channel.send([to], {
    notification: {
      title: "This is a test Notification",
      body: `
          This is a test Notification!!!!!!

          CID: ${cid}
          Key: ${key}
          FileInfo: ${fileInfo}
          
        `,
    },
  });
  console.log("sendNotifRes:", { sendNotifRes });
};
