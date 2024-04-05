import { useContext, useEffect, useState } from "react";
import * as dotenv from "dotenv";
import "dotenv/config";
import { GlobalContext } from "@/context/GlobalProvider";

dotenv.config();
const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

type GetNodeResponse = {
  metadata: any;
  subfolder_key: string;
  root_id: string;
  file_data: any;
  children: any[];
};

export const useGetNode = (subfolder_key: string, cid: string) => {
  const [data, setData] = useState<GetNodeResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const {
    accessToken,
    setAccessToken,
    loading,
    setLoading,
    setRootId,
    setRootKey,
    setCurrentNodeCid,
    setCurrentNodeKey,
  } = useContext(GlobalContext);

  const getNode = async () => {
    console.log("subfolder_keyyy:", subfolder_key);
    console.log("cidddd:", cid);
    if (!subfolder_key || !cid) return;
    setLoading(true);
    try {
      setData(null);
      const res = await fetch(`${baseUrl}/api/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          subfolder_key,
          cid,
        }),
      });

      console.log("res:", res);

      if (!res.ok) {
        throw new Error("Failed to Get Node");
      }

      const data = await res.json();
      setData(data);
    } catch (err) {
      setData(data);
      console.error("err:", err);
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNode();
  }, [subfolder_key, cid]);

  return { data, getNode, loading, error };
};
