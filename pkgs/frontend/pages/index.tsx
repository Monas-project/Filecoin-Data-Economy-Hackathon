import { useEthersSigner } from "@/hooks/useEthersProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { filecoinCalibration } from "viem/chains";
import { useAccount } from "wagmi";

export default function Login() {
  const account = useAccount();
  const signer = useEthersSigner({ chainId: filecoinCalibration.id });

  return (
    <div className="w-screen h-screen flex flex-row">
      <ConnectButton />
    </div>
  );
}
