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

export const createNode = async (accessToken: string, formData: FormData) => {
  console.log("formData:", formData);

  if (!formData) return;
  try {
    const res = await fetch(`${baseUrl}/api/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
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
