import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Login() {
  
  const account = useAccount();

  return (
    <div className="w-screen h-screen flex flex-row">
      <ConnectButton />
    </div>
  );
}
