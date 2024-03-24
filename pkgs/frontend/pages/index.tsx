import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import { useEthersSigner } from "@/hooks/useEthersProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { filecoinCalibration } from "viem/chains";
import { useAccount } from "wagmi";

export default function Login() {
  const account = useAccount();
  const router = useRouter();
  const signer = useEthersSigner({ chainId: filecoinCalibration.id });
  const globalContext = useContext(GlobalContext);

  useEffect(() => {
    if (account.address != undefined) {
      router.push("/my-box");
    }
  }, [account]);

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
                                  globalContext.setLoading(true);
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
                              <button
                                onClick={openChainModal}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                type="button"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 12,
                                      height: 12,
                                      borderRadius: 999,
                                      overflow: "hidden",
                                      marginRight: 4,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? "Chain icon"}
                                        src={chain.iconUrl}
                                        style={{ width: 12, height: 12 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </button>

                              <button onClick={openAccountModal} type="button">
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ""}
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
