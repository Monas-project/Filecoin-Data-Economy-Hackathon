import Button from "@/components/elements/Button/Button";
import CompoundButton from "@/components/elements/Button/CompoundButton";
import Dialog from "@/components/elements/Dialog/Dialog";
import FileFormatIcon from "@/components/elements/FileFormatIcon/FileFormatIcon";
import Input from "@/components/elements/Input/Input";
import { VerticalTabProps } from "@/components/elements/Tabs/VerticalTab";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import { GlobalContext } from "@/context/GlobalProvider";
import { getBox } from "@/cryptree/getBox";
import { downloadFile } from "@/utils/downloadFile";
import {
  ArrowDownload20Regular,
  Delete20Regular,
  Grid20Filled,
  MailInbox20Filled,
  MoreVertical16Regular,
} from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";

export default function SharedBox() {
  const [isGetBoxModalOpen, setIsGetBoxModalOpen] = useState(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [cid, setCid] = useState<string>("");
  const [subfolderKey, setSubfolderKey] = useState<string>("");
  const globalContext = useContext(GlobalContext);
  const { accessToken, setLoading } = globalContext;
  const [node, setNode] = useState<any>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const fileTableTr = [
    { th: "Name", width: 55, mWidth: 300 },
    { th: "Owner", width: 12.5, mWidth: 100 },
    { th: "Data Modified", width: 12.5, mWidth: 100 },
    { th: "", width: 20, mWidth: 152 },
  ];

  const receive = async () => {
    if (!accessToken) {
      return;
    }
    if (!cid || !subfolderKey) {
      return;
    }
    setLoading(true);
    try {
      const res = await getBox(accessToken!, subfolderKey, cid);
      setNode(res);
      setLoading(false);
      console.log("resaaa");
      console.log(res);
    } catch (err) {
      console.error("err:", err);
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    downloadFile(node.file_data, node.metadata.name);
  };

  const handleCloseButton = () => {
    setIsGetBoxModalOpen(false);
    setCid('');
    setSubfolderKey('');
  };

  useEffect(() => {
    if (cid.trim() === '' || subfolderKey.trim() === '') {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [cid, subfolderKey])

  return (
    <LayoutMain>
      <div className="bg-Neutral-Background-2-Rest h-full w-full flex flex-col text-Neutral-Foreground-1-Rest overflow-y-auto">
        <div className="flex flex-col space-y-4 p-6 shadow-Elevation01-Light dark:shadow-Elevation01-Dark sticky top-0 bg-Neutral-Background-2-Rest">
          <div className="flex flex-row justify-between items-center">
            <div className="text-TitleLarge">Shared Box</div>
            <Button
              layout="subtle"
              headerVisible={true}
              headerIcon={<Grid20Filled />}
              labelVisible={false}
            ></Button>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4">
              <Button label="Type" fotterVisible={true} />
              <Button label="People" fotterVisible={true} />
              <Button label="Modified" fotterVisible={true} />
            </div>
            <div className="flex flex-row space-x-4">
              <Button
                headerVisible={true}
                headerIcon={<MailInbox20Filled />}
                label="Get Box"
                onClick={() => setIsGetBoxModalOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="w-full grow flex flex-col p-6 space-y-6">
          <div className="grow rounded-lg px-6 bg-Neutral-Background-1-Rest">
            <table className="w-full inline-block">

              <thead className="flex border-b border-Neutral-Stroke-1-Rest text-TitleSmall text-Neutral-Foreground-Variant-Rest">
                <tr className="w-full h-fit flex flex-row space-x-8 px-6 py-4 text-left [&_th]:p-0 [&_th]:font-medium">
                  {fileTableTr.map((x) => (
                    <th key={x.th} style={{ width: `${x.width}%`, minWidth: `${x.mWidth}px` }}>
                      {x.th}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="flex flex-col w-full last:[&>tr]:border-none">
                {node ? (
                  <tr
                    onClick={() => setIsSelected(!isSelected)}
                    className={`w-full flex flex-row pl-8 py-3 space-x-8 border-b border-NV150 text-BodyLarge text-NV10 items-center group 
                                            ${isSelected
                        ? "bg-N70"
                        : "bg-N96 hover:bg-N90"
                      }
                        [&>td]:flex`}
                  >
                    <td
                      style={{ width: `${fileTableTr[0].width}%` }}
                      className="flex flex-row items-center space-x-6"
                    >
                      <FileFormatIcon fileType='DocumentIcon' />
                      <div>{node.metadata.name}</div>
                    </td>
                    <td style={{ width: `${fileTableTr[1].width}%` }}>
                      {node.metadata.owner_id
                        .substring(0, 6)
                        .concat("...")
                        .concat(
                          node.metadata.owner_id.substring(
                            node.metadata.owner_id.length - 6
                          )
                        )}
                    </td>
                    <td style={{ width: `${fileTableTr[2].width}%` }}>
                      {new Date(node.metadata.created_at).toLocaleDateString() +
                        " " +
                        new Date(node.metadata.created_at).toLocaleTimeString()}
                    </td>
                    <td
                      style={{ width: `${fileTableTr[3].width}%` }}
                      className="space-x-5 pr-8 justify-end items-center"
                    >
                      <div
                        className={`space-x-3 flex-row group-hover:flex ${isSelected ? "flex" : "hidden"
                          }`}
                      >
                        <Button
                          layout="subtle"
                          headerVisible={true}
                          headerIcon={<ArrowDownload20Regular />}
                          labelVisible={false}
                          onClick={download}
                        />
                        <Button
                          layout="subtle"
                          headerVisible={true}
                          headerIcon={<Delete20Regular />}
                          labelVisible={false}
                        />
                      </div>
                      <MoreVertical16Regular />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {/* GetBox Button Dialog */}
        {isGetBoxModalOpen && (
          <div
            onClick={(e) => e.target === e.currentTarget && setIsGetBoxModalOpen(false)}
            className="fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
          >
            <Dialog
              primaryButtonProps={{ label: 'Receive', onClick: receive, disabled: isButtonDisabled, }}
              secondaryButtonProps={{ label: 'Close', onClick: handleCloseButton, }}
            >
              <div className="py-6 text-center">
                <span className="text-TitleLarge text-Neutral-Foreground-1-Rest">Get Box</span>
              </div>
              <div className="space-y-4">
                <Input
                  id="uri"
                  label="URI"
                  inputValue={cid}
                  setInputValue={setCid}
                  layout="filledDarker"
                />
                <Input
                  id="secretKey"
                  label="Secret Key"
                  inputValue={subfolderKey}
                  setInputValue={setSubfolderKey}
                  layout="filledDarker"
                />
              </div>
            </Dialog>
          </div>
        )}
      </div>
    </LayoutMain>
  );
}
