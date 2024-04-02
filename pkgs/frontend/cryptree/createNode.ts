import "dotenv/config";
import * as dotenv from "dotenv";

dotenv.config();
const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

type CreateNodeResponse = {
  metadata: any;
  cid: any;
  subfolder_key: any;
  root_id: any;
};

export const createNode = async (
  accessToken: string,
  name: string,
  owner_id: string,
  parent_cid: string,
  subfolder_key: string,
  file_data: string | null = null
) => {
  console.log("owner_id:", owner_id);

  if (!name || !owner_id || !subfolder_key || !parent_cid) return;
  try {
    const res = await fetch(`${baseUrl}/api/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        owner_id,
        parent_cid,
        subfolder_key,
        file_data,
      }),
    });

    console.log("res:", res);

    if (!res.ok) {
      throw new Error("Failed to Get Node");
    }

    const data = await res.json();
    console.log("data:", data);

    return data;
  } catch (err) {
    console.error("err:", err);
  }
};
