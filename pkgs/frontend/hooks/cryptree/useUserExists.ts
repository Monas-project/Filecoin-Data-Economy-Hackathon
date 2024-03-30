import { GlobalContext } from "@/context/GlobalProvider";
import * as dotenv from "dotenv";
import "dotenv/config";
import { useContext, useEffect, useState } from "react";

dotenv.config();

const baseUrl: string = process.env.CRYPTREE_API_URL || "http://localhost:8000";

export const useUserExists = (
  address: `0x${string}`,
  signature: `0x${string}`
) => {
  const [data, setData] = useState({
    exists: false,
  });
  const [error, setError] = useState<Error | null>(null);
  const { loading, setLoading } = useContext(GlobalContext);

  const userExists = async () => {
    if (!address || !signature) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/user/exists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          signature,
        }),
      });

      console.log("res:", res);
      console.log("res.status:", res.status);

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to signup");
      }

      setData(data);
    } catch (err) {
      console.error("err:", err);
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  return { userExists, data, loading, error };
};
