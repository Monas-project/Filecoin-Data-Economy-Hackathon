This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Sample for PushProtcol

`index.ts`

```ts
import { useEthersSigner } from "@/hooks/useEthersProvider";
import { getPushInfo, sendNotification } from "@/hooks/usePushProtocol";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { filecoinCalibration } from "viem/chains";
import { useAccount } from "wagmi";

export default function Login() {
  const account = useAccount();
  const signer = useEthersSigner({ chainId: filecoinCalibration.id });

  useEffect(() => {
    const init = async () => {
      if (signer != undefined) {
        await getPushInfo(signer);
      }
    };
    init();
  }, [account]);

  const sendNotificate = async () => {
    await sendNotification();
  };

  return (
    <div className="w-screen h-screen flex flex-row">
      <ConnectButton />
      <button onClick={sendNotificate}>Send Sample Notification</button>
    </div>
  );
}
```
