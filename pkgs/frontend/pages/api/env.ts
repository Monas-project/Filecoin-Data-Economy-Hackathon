import type { NextApiRequest, NextApiResponse } from "next";

export type ResponseData = {
  WALLET_CONNECT_PROJECT_ID: string;
  SEPOLIA_RPC_URL: string;
  PUSH_PROTOCOL_PRIVATE_KEY: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const env: ResponseData = {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID!,
    SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL!,
    PUSH_PROTOCOL_PRIVATE_KEY: process.env.PUSH_PROTOCOL_PRIVATE_KEY!,
  };

  res.status(200).json(env);
}
