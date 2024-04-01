import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import { useEthersSigner } from "@/hooks/useEthersProvider";
import { getEnv } from "@/utils/getEnv";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { filecoinCalibration } from "viem/chains";
import { useAccount, useSignMessage } from "wagmi";
import { ResponseData } from "./api/env";
import { useSignUp } from "@/hooks/cryptree/useSignUp";
import { useLogin } from "@/hooks/cryptree/useLogin";

export default function Login() {
  const [env, setEnv] = useState<ResponseData>();
  const account = useAccount();
  const router = useRouter();
  const signer = useEthersSigner({ chainId: filecoinCalibration.id });
  const globalContext = useContext(GlobalContext);
  const { data: signMessageData, signMessageAsync } = useSignMessage();
  const { data: signUpData } = useSignUp(account?.address!, signMessageData!);
  const { data: loginData } = useLogin(account?.address!, signMessageData!);

  /**
   * authenticate
   */
  const authenticate = async () => {
    try {
      globalContext.setLoading(true);
      // get .env values
      const envData = await getEnv();
      await signMessageAsync({ message: envData.SECRET_MESSAGE });
    } catch (err) {
      console.error("error:", err);
    } finally {
      globalContext.setLoading(false);
    }
  };

  useEffect(() => {
    console.log("signMessageData:", signMessageData);
    if (signMessageData) {
      if (signUpData) {
        console.log("signUpData:", signUpData);
        router.push("/my-box");
      } else if (loginData) {
        console.log("loginData:", loginData);
        router.push("/my-box");
      }
    }
  }, [signMessageData, signUpData, loginData]);

  return (
    <div className={`w-screen h-screen bg-HeroImage bg-cover text-N16`}>
      <div className="w-full h-full p-20 flex items-center">
        <div>
          {globalContext.loading ? (
            <Loading />
          ) : (
            <>
              <h1 className="py-12 text-DisplayLarge">
                Welcome to Monas<span className="text-P90">.</span>
              </h1>
              <p className="pb-10 text-HeadlineSmall">
                Give you the power of data and <br />
                the future is yours to decide!
              </p>
              <div className="space-y-2">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                    return (
                      <div
                        className="w-fit text-LabelMediumProminent text-center [&_button]:rounded-full [&_button]:p-1.5 [&_button]:bg-P80 [&_button]:hover:bg-P70 [&_button]:active:bg-P50 [&_button]:disabled:bg-S80 text-N96 [&_button]:disabled:text-N72 [&_button]:w-72"
                        {...(!ready && {
                          "aria-hidden": true,
                          style: {
                            opacity: 0,
                            pointerEvents: "none",
                            userSelect: "none",
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                onClick={() => {
                                  openConnectModal();
                                }}
                                type="button"
                              >
                                Connect Wallet
                              </button>
                            );
                          }
                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} type="button">
                                Wrong network
                              </button>
                            );
                          }

                          return (
                            <div style={{ display: "flex", gap: 12 }}>
                              <button onClick={authenticate} type="button">
                                signUp/login
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
