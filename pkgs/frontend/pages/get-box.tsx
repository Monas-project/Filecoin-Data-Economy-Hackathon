import Button from "@/components/elements/Button/Button";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import { signer } from "@/hooks/useEthersProvider";
import { getPushInfo } from "@/hooks/usePushProtocol";
import { ListInfo } from "@/utils/type";
import { CheckboxUnchecked24Regular } from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";

export default function GetBox() {
  const [pushList, setPushList] = useState<ListInfo[]>([]);
  const globalContext = useContext(GlobalContext);

  useEffect(() => {
    const init = async () => {
      globalContext.setLoading(true);
      if (signer != undefined) {
        const list = await getPushInfo(signer);
        setPushList(list);
      }
      globalContext.setLoading(false);
    };
    init();
  }, []);

  return (
    <LayoutMain>
      <div className="bg-Neutral-Background-2-Rest h-full w-full flex flex-col text-Neutral-Foreground-1-Rest overflow-y-auto">

        {globalContext.loading ? (
          <Loading />
        ) : (
          <>

            <div className="flex flex-col space-y-4 p-6 shadow-Elevation01-Light dark:shadow-Elevation01-Dark sticky top-0 bg-Neutral-Background-2-Rest">
              <div className="flex flex-row justify-between items-center">
                <div className="text-TitleLarge">Get Box</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                  <Button fotterVisible={true} label="Type"/>
                  <Button fotterVisible={true} label="People"/>
                  <Button fotterVisible={true} label="Modified"/>
                </div>
                <div className="flex flex-row space-x-4">
                  
                </div>
              </div>
            </div>

            <div className="p-6">
              <table className="w-full">
                <tbody className="space-y-4">
                  <tr
                    className="overflow-hidden w-full rounded-lg flex flex-col bg-N96 border border-N42
                                    [&>td]:flex [&>td]:px-2.5 [&>td]:py-3.5"
                  >
                    {pushList.length != 0 && (
                      <>
                        {pushList.map((push, i) => (
                          <>
                            <td className="flex-row space-x-3 border-b border-N42">
                              <CheckboxUnchecked24Regular />
                              <div className="w-full text-TitleLarge">
                                {push.title}
                              </div>
                            </td>
                            <td className="flex-col space-y-3 text-BodyLarge [&>div]:flex [&>div]:flex-row">
                              <div className="space-x-2 whitespace-pre-line">
                                {`${push.message}`}
                              </div>
                            </td>
                          </>
                        ))}
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </LayoutMain>
  );
}
