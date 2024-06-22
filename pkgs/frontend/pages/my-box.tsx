import Button from "@/components/elements/Button/Button";
import CompoundButton from "@/components/elements/Button/CompoundButton";
import FileFormatIcon from "@/components/elements/FileFormatIcon/FileFormatIcon";
import Input from "@/components/elements/Input/Input";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import Loading from "@/components/loading";
import { GlobalContext } from "@/context/GlobalProvider";
import {
  TableData,
  createContract,
  deleteTableData,
  getAllTableData,
  getSelectedTableData,
  insertTableData,
} from "@/hooks/useContract";
import { sendNotification } from "@/hooks/usePushProtocol";
import {
  ArrowDownload20Regular,
  Delete20Regular,
  DocumentArrowUp20Regular,
  FolderAdd20Regular,
  Grid20Filled,
  Key20Regular,
  MoreVertical16Regular,
  Share20Regular,
} from "@fluentui/react-icons";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useWalletClient } from "wagmi";
import { ResponseData } from "./api/env";
import { useGetNode } from "@/hooks/cryptree/useGetNode";
import { useRouter } from "next/router";
import { createNode } from "@/cryptree/createNode";
import FileUpload from "@/components/elements/FileUpload/FileUpload";
import { downloadFile } from "@/utils/downloadFile";
import { reEncryptNode } from "@/cryptree/reEncryptNode";
import Breadcrumb from "@/components/elements/Breadcrumb/Breadcrumb";
import According from "@/components/elements/According/According";

const fileTableTr = [
  { th: "Name", width: 55, mWidth: 300 },
  { th: "Owner", width: 12.5, mWidth: 100 },
  { th: "Data Modified", width: 12.5, mWidth: 100 },
  { th: "", width: 20, mWidth: 152 },
];

export default function MyBox() {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isSelectedId, setIsSelectedId] = useState<any>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [tableDatas, setTableDatas] = useState<TableData[]>();
  const [to, setTo] = useState<any>();
  const [env, setEnv] = useState<ResponseData>();
  const router = useRouter();
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [sharingData, setSharingData] = useState<any>(null);

  const globalContext = useContext(GlobalContext);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const {
    rootId,
    rootKey,
    accessToken,
    setRootId,
    currentNodeCid,
    setCurrentNodeCid,
    currentNodeKey,
    setCurrentNodeKey,
  } = globalContext;
  const { data: getNodeData, error: getNodeError } = useGetNode(
    currentNodeKey!,
    currentNodeCid!
  );

  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([
    {
      text: "Own Space",
      path: "/my-box",
      cid: rootId!,
      key: rootKey!,
    },
  ]);

  const openShareModal = (cid: string, key: string) => {
    setSharingData({ cid, key });
    setIsShareModalOpen(true);
  };

  const openNode = async (name: string, cid: string, subfolderKey: string) => {
    setCurrentNodeCid(cid);
    setCurrentNodeKey(subfolderKey);
    const items = breadcrumbItems;
    setBreadcrumbItems([
      ...items,
      {
        text: name,
        path: "/my-box",
        cid,
        key: subfolderKey,
      },
    ]);
  };

  const moveToDir = (index: number) => {
    const items = breadcrumbItems.slice(0, index + 1);
    setCurrentNodeCid(breadcrumbItems[index].cid);
    setCurrentNodeKey(breadcrumbItems[index].key);
    setBreadcrumbItems(items);
  };

  /**
   * uploadFile function
   */
  const uploadFile = async (selectedFile: File | null) => {
    if (!selectedFile) return; // ファイルが選択されていなければ早期リターン

    const formData = new FormData();
    formData.append("file_data", selectedFile);
    formData.append("name", selectedFile.name);
    formData.append("owner_id", address!);
    formData.append("subfolder_key", currentNodeKey!);
    formData.append("parent_cid", currentNodeCid!);

    // ここにファイルアップロードのためのAPI呼び出し処理を記述します
    console.log("ファイルをアップロード中…");
    // 例: axios.post('your-upload-endpoint', formData);
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree
      // call same API when upload file & create folder
      const res = await createNode(accessToken!, formData);

      setRootId(res.root_id);
      setCurrentNodeCid(res.root_id);
      setCurrentNodeKey(rootKey!);
      setBreadcrumbItems([
        {
          text: "Own Space",
          path: "/my-box",
          cid: rootId!,
          key: rootKey!,
        },
      ]);
      // call insert method
      await insertTableData(res.root_id, res.cid);

      toast.success(
        "Upload Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err uploadFile:", err);
      toast.error("Failed...1", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      globalContext.setLoading(false);
      setIsFileUploadModalOpen(false);
    }
  };

  /**
   * createFolder function
   */
  const createFolder = async () => {
    if (!address || !currentNodeCid || !currentNodeKey) return;
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree
      // call same API when upload file & create folder
      // call insert method
      const formData = new FormData();
      formData.append("name", "test " + Math.random().toString(36).slice(-8));
      formData.append("owner_id", address);
      formData.append("subfolder_key", currentNodeKey!);
      formData.append("parent_cid", currentNodeCid!);
      const res = await createNode(accessToken!, formData);
      setRootId(res.root_id);
      setCurrentNodeCid(res.root_id);
      setCurrentNodeKey(rootKey!);
      setBreadcrumbItems([
        {
          text: "Own Space",
          path: "/my-box",
          cid: rootId!,
          key: rootKey!,
        },
      ]);

      // fileの場合は、file_dataにデータが入る
      if (res.metadata.children.length > 0 && res.metadata.children[0].fk) {
        await insertTableData(res.root_id, res.cid);
      }

      toast.success(
        "CreateFolder Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err createFolder:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      globalContext.setLoading(false);
    }
  };

  /**
   * deleteFile function
   */
  const deleteFile = async (id: any) => {
    try {
      globalContext.setLoading(true);
      // call delate data method
      await deleteTableData(id);
      toast.success(
        "Delete File Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err deleteFile:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      globalContext.setLoading(false);
    }
  };

  /**
   * shareFile function
   */
  const shareFile = async () => {
    try {
      globalContext.setLoading(true);
      // TODO get key value by calling cryptree API

      console.log("to:", to);
      // get selectedId's table data
      const results: TableData[] = await getSelectedTableData(isSelectedId);
      console.log("results[0]:", results[0]);
      // call sendNotification method
      await sendNotification(to, sharingData?.cid, sharingData?.key, rootId!);

      toast.success(
        "Share File Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err shareFile:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      globalContext.setLoading(false);
    }
  };

  /**
   * reEncrypt function
   */
  const reEncrypt = async (targetCid: string) => {
    try {
      globalContext.setLoading(true);
      // TODO call reEncrypt API from cryptree
      // TODO call ipfs API from cryptree
      // TODO call upate query

      const res = await reEncryptNode(
        accessToken!,
        targetCid,
        currentNodeKey!,
        currentNodeCid!
      );

      console.log("res:", res);

      toast.success(
        "reEncrypt File Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err reEncrypt:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      globalContext.setLoading(false);
    }
  };

  /**
   * download function
   */
  const download = async (data: string, name: string) => {
    try {
      globalContext.setLoading(true);
      // TODO CID
      // Fileオブジェクトをダウンロードする処理を入れる。
      downloadFile(data, name);

      toast.success(
        "download File Success!! Please wait a moment until it is reflected.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (err) {
      console.error("err reEncrypt:", err);
      toast.error("Failed...", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      globalContext.setLoading(false);
    }
  };

  /*   useEffect(() => {
      globalContext.setLoading(false);
      const init = async () => {
        if (!isConnected && !address) {
          router.push("/");
          return;
        }
        globalContext.setLoading(true);
        try {
          // init contract
          await createContract(walletClient);
          // get all table data
  
          // await getNode();
          const tableData = await getAllTableData();
          console.log("getNodeData:", getNodeData);
          const metadata = getNodeData?.metadata;
          const children = getNodeData?.children;
          const datas = children;
          setTableDatas(datas);
          // TODO call fetch API from cryptree
        } catch (err) {
          console.error("err", err);
        } finally {
          globalContext.setLoading(false);
        }
      };
      init();
    }, [currentNodeCid, currentNodeKey, isConnected]); */

  return (
    <LayoutMain>
      <div className="bg-Neutral-Background-2-Rest h-full w-full flex flex-col text-Neutral-Foreground-1-Rest overflow-y-auto">
        {globalContext.loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col space-y-4 p-6 shadow-Elevation01-Light dark:shadow-Elevation01-Dark sticky top-0 bg-Neutral-Background-2-Rest">
              <div className="flex flex-row justify-between items-center">
                <Breadcrumb items={breadcrumbItems} onNavigate={moveToDir} />
                <Button
                  layout="subtle"
                  headerVisible={true}
                  headerIcon={<Grid20Filled />}
                  labelVisible={false}
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-4">
                  <Button label="Type" fotterVisible={true} />
                  <Button label="People" fotterVisible={true} />
                  <Button label="Modified" fotterVisible={true} />
                </div>
                <div className="flex flex-row space-x-4">
                  <Button label="Upload File" headerVisible={true} headerIcon={<DocumentArrowUp20Regular />} onClick={() => setIsFileUploadModalOpen(true)} />
                  <Button label="Create Folder" headerVisible={true} headerIcon={<FolderAdd20Regular />} onClick={createFolder} />
                </div>
              </div>
            </div>

            <div className="w-full grow flex flex-col p-6 space-y-6">
              {/* <div>{JSON.stringify(getNodeData)}</div> */}
              <According label="Recent Files">
                <div className="w-full flex flex-row space-x-4 pl-6 first:pl-0">
                  <CompoundButton headerIcon={<FileFormatIcon fileType="FolderIcon" />} layout="neutral" primaryText="AAAAAAAAAA" secondaryText="3 days ago" />
                  <CompoundButton headerIcon={<FileFormatIcon fileType="FolderIcon" />} layout="neutral" primaryText="AAAAAAAAAA" secondaryText="3 days ago" />
                  <CompoundButton headerIcon={<FileFormatIcon fileType="FolderIcon" />} layout="neutral" primaryText="AAAAAAAAAA" secondaryText="3 days ago" />
                  <CompoundButton headerIcon={<FileFormatIcon fileType="FolderIcon" />} layout="neutral" primaryText="AAAAAAAAAA" secondaryText="3 days ago" />
                  <CompoundButton headerIcon={<FileFormatIcon fileType="FolderIcon" />} layout="neutral" primaryText="AAAAAAAAAA" secondaryText="3 days ago" />
                  <CompoundButton headerIcon={<FileFormatIcon fileType="FolderIcon" />} layout="neutral" primaryText="AAAAAAAAAA" secondaryText="3 days ago" />
                </div>
              </According>

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
                    {getNodeData?.children?.map((data: any, i) => (
                      <tr
                        key={i}
                        onClick={() => {
                          setIsSelected(!isSelected);
                          setIsSelectedId(getNodeData.metadata.children[i].cid);
                        }}
                        onDoubleClick={() =>
                          openNode(
                            data.metadata.name,
                            getNodeData.metadata.children[i].cid,
                            data.subfolder_key
                          )
                        }
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
                          {data.file_data && data.file_data.length > 0 ? (
                            <FileFormatIcon fileType='DocumentIcon' />
                          ) : (
                            <FileFormatIcon fileType='FolderIcon' />
                          )}
                          <div className="ml-4">{data.metadata.name}</div>
                        </td>
                        <td style={{ width: `${fileTableTr[1].width}%` }}>
                          {data.metadata.owner_id.slice(0, 6) +
                            "..." +
                            data.metadata.owner_id.slice(-4)}
                        </td>
                        <td style={{ width: `${fileTableTr[2].width}%` }}>
                          {new Date(
                            data.metadata.created_at
                          ).toLocaleDateString() +
                            " " +
                            new Date(
                              data.metadata.created_at
                            ).toLocaleTimeString()}
                        </td>
                        <td
                          style={{ width: `${fileTableTr[3].width}%` }}
                          className="space-x-5 pr-8 justify-end items-center"
                        >
                          <div
                            className={`space-x-3 flex-row group-hover:flex ${isSelected ? "flex" : "hidden"
                              }`}
                          >
                            {data.file_data && data.file_data.length > 0 ? (
                              <Button
                                layout="subtle"
                                headerVisible={true}
                                headerIcon={<ArrowDownload20Regular />}
                                labelVisible={false}
                                onClick={() =>
                                  download(data.file_data, data.metadata.name)
                                }
                              ></Button>
                            ) : null}
                            <Button
                              onClick={() => {
                                const key = getNodeData?.metadata.children[i].fk
                                  ? getNodeData?.metadata.children[i].fk
                                  : getNodeData?.metadata.children[i].sk;
                                openShareModal(
                                  getNodeData?.metadata.children[i].cid,
                                  key
                                );
                              }}
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Share20Regular />}
                              labelVisible={false}
                            />
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Delete20Regular />}
                              labelVisible={false}
                              onClick={async () => {
                                await deleteFile(data.id);
                              }}
                            />
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Key20Regular />}
                              labelVisible={false}
                              onClick={() =>
                                reEncrypt(getNodeData.metadata.children[i].cid)
                              }
                            />
                          </div>
                          <MoreVertical16Regular />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {isFileUploadModalOpen && (
          <div
            onClick={(e) => e.target === e.currentTarget && setIsFileUploadModalOpen(false)}
            className="fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
          >
            <FileUpload
              onFileSelect={(file) => console.log("file: ", file)}
              uploadFile={uploadFile}
              close={() => setIsFileUploadModalOpen(false)}
            />
          </div>
        )}

        {/* Share Button Dialog */}
        {isShareModalOpen && (
          <div
            onClick={(e) =>
              e.target === e.currentTarget && setIsShareModalOpen(false)
            }
            className="fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
          >
            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 rounded-lg bg-Neutral-Background-1-Rest p-8 space-y-6">
              <div className="text-TitleLarge">Address</div>
              <Input
                id="address"
                label=""
                layout="outline"
                inputValue={to}
                setInputValue={setTo}
              />
              <div className="w-full flex flex-row justify-between">
                <Button
                  layout="neutral"
                  label="Close"
                  onClick={() => setIsShareModalOpen(false)}
                />
                <Button
                  layout="primary"
                  label="send"
                  onClick={async () => {
                    // call shareFile method
                    await shareFile();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </LayoutMain>
  );
}
