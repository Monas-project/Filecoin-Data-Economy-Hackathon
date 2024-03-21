import { ResponseData } from "@/pages/api/env";

/**
 * 環境変数を取得するためのメソッド
 */
export const getEnv = async (): Promise<ResponseData> => {
  const res = await fetch("/api/env");
  const env: ResponseData = await res.json();
  return env;
};
