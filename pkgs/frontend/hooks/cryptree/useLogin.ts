import { useContext, useEffect, useState } from "react";
import * as dotenv from "dotenv";
import "dotenv/config";
import { GlobalContext } from "@/context/GlobalProvider";
import { useUserExists } from "./useUserExists";

dotenv.config();
const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

export const useLogin = (address: `0x${string}`, signature: `0x${string}`) => {
  const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(false);
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

  const { data: userExistsData, error: userExistsError } = useUserExists(
    address,
    signature
  );

  const login = async () => {
    if (!address || !signature) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature }),
      });

      console.log("res:", res);

      if (!res.ok) {
        throw new Error("Failed to login");
      }

      const data = await res.json();

      if (data.access_token) {
        setAccessToken(data.access_token);
      }

      setData(data);
      setCurrentNodeCid(data?.root_node?.root_id);
      setCurrentNodeKey(data?.root_node?.subfolder_key);
      setRootId(data?.root_node?.root_id);
      setRootKey(data?.root_node?.subfolder_key);
    } catch (err) {
      console.error("err:", err);
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userExistsData?.exists === false) {
      return;
    }
    console.log("useEffect: useLogin");
    login();
  }, [userExistsData, accessToken]);

  return { data, login, loading, error };
};
