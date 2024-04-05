import Button from "@/components/elements/Button/Button";
import CompoundButton from "@/components/elements/Button/CompoundButton";
import {
  DocumentIcon,
  FolderIcon,
} from "@/components/elements/FileFormatIcon/FileFormatIcon";
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
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { ResponseData } from "./api/env";
import { useGetNode } from "@/hooks/cryptree/useGetNode";
import { useUserExists } from "@/hooks/cryptree/useUserExists";
import { useRouter } from "next/router";
import { createNode } from "@/cryptree/createNode";
import FileUpload from "@/components/elements/FileUpload/FileUpload";
import { downloadFile } from "@/utils/downloadFile";

const fileTableTr = [
  { th: "Name", width: 35 },
  { th: "Owner", width: 25 },
  { th: "Data Modified", width: 14 },
  { th: "More", width: 20 },
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
  console.log("account:", address);
  console.log("isConnected:", isConnected);
  const { data: signMessageData, signMessageAsync } = useSignMessage();
  const { rootId, rootKey, accessToken, setRootId } = globalContext;
  const {
    data: getNodeData,
    getNode,
    error: getNodeError,
  } = useGetNode(rootKey!, rootId!);

  const {
    userExists,
    data: userExistsData,
    error: userExistsError,
  } = useUserExists(walletClient?.account?.address!, signMessageData!);

  const openShareModal = (cid: string, key: string) => {
    setSharingData({ cid, key });
    setIsShareModalOpen(true);
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
    formData.append("subfolder_key", rootKey!);
    formData.append("parent_cid", rootId!);

    // ここにファイルアップロードのためのAPI呼び出し処理を記述します
    console.log("ファイルをアップロード中…");
    // 例: axios.post('your-upload-endpoint', formData);
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree
      // call same API when upload file & creat folder
      const res = await createNode(accessToken!, formData);

      // call insert method
      setRootId(res.root_id);
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
      setIsFileUploadModalOpen(false);
    }
  };

  /**
   * createFolder function
   */
  const createFolder = async () => {
    if (!address || !rootId) return;
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree
      // call same API when upload file & create folder
      // call insert method
      const formData = new FormData();
      formData.append("name", "test " + Math.random().toString(36).slice(-8));
      formData.append("owner_id", address);
      formData.append("subfolder_key", rootKey!);
      formData.append("parent_cid", rootId!);
      const res = await createNode(accessToken!, formData);
      setRootId(res.root_id);
      console.log("datata:", res);

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
  const reEncrypt = async () => {
    try {
      globalContext.setLoading(true);
      // TODO call reEncrypt API from cryptree
      // TODO call ipfs API from cryptree
      // TODO call upate query

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

  useEffect(() => {
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

        await getNode();
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
  }, [rootId, isConnected]);

  return (
    <LayoutMain>
      <div className="bg-N92 h-full w-full flex flex-col text-N16 overflow-y-auto">
        {globalContext.loading ? (
          <Loading />
        ) : (
          <>
            <div className="w-full flex flex-col space-y-6 px-8 py-6 shadow-Elevation01 sticky top-0 bg-N92">
              <div className="flex flex-row justify-between">
                <div className="text-TitleLarge">Own Space</div>
                <Button
                  layout="subtle"
                  headerVisible={true}
                  headerIcon={<Grid20Filled />}
                  labelVisible={false}
                ></Button>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row space-x-6">
                  <Button fotterVisible={true}>Type</Button>
                  <Button fotterVisible={true}>People</Button>
                  <Button fotterVisible={true}>Modified</Button>
                </div>
                <div className="flex flex-row space-x-6">
                  <Button
                    layout="neutral"
                    headerVisible={true}
                    headerIcon={<DocumentArrowUp20Regular />}
                    onClick={() => setIsFileUploadModalOpen(true)}
                  >
                    Upload File
                  </Button>
                  <Button
                    layout="neutral"
                    headerVisible={true}
                    headerIcon={<FolderAdd20Regular />}
                    onClick={createFolder}
                  >
                    Create Folder
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full grow flex flex-col px-8 py-6 space-y-8">
              <div className="w-full space-y-4">
                <div className="text-TitleMedium">Recent Files</div>
                {/* <div>{JSON.stringify(getNodeData)}</div> */}
                <div className="flex flex-row px-8 space-x-4">
                  <CompoundButton
                    headerIcon={<FolderIcon />}
                    layout="neutral"
                    primaryText="AAAAAAAAAA"
                    secondaryText="3 days ago"
                  />
                </div>
              </div>
              <div className="w-full grow rounded-lg px-6 bg-N96">
                <table className="w-full inline-block">
                  <thead className="w-full flex flex-row px-4 py-4 border-b border-NV130 text-TitleSmall text-NV60">
                    <tr className="w-full h-fit flex [&_th]:p-0 [&_th]:inline-block space-x-8 [&_th]:font-medium">
                      {fileTableTr.map((x) => (
                        <th key={x.th} style={{ width: `${x.width}%` }}>
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
                        className={`w-full flex flex-row pl-8 py-3 space-x-8 border-b border-NV150 text-BodyLarge text-NV10 items-center group 
                                              ${
                                                isSelected
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
                            <DocumentIcon />
                          ) : (
                            <FolderIcon />
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
                            className={`space-x-3 flex-row group-hover:flex ${
                              isSelected ? "flex" : "hidden"
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
                            ></Button>
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Delete20Regular />}
                              labelVisible={false}
                              onClick={async () => {
                                await deleteFile(data.id);
                              }}
                            ></Button>
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<Key20Regular />}
                              labelVisible={false}
                              onClick={reEncrypt}
                            ></Button>
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
            onClick={(e) =>
              e.target === e.currentTarget && setIsFileUploadModalOpen(false)
            }
            className="fixed top-0 left-0 right-0 bottom-0 bg-N0/60"
          >
            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 rounded-lg bg-N96 p-8 space-y-6">
              <div className="text-TitleLarge">Upload File</div>
              {/* uploading file */}

              <FileUpload
                onFileSelect={(file) => console.log("file: ", file)}
                uploadFile={uploadFile}
                close={() => setIsFileUploadModalOpen(false)}
              />
            </div>
          </div>
        )}
        {/* Share Button Dialog */}
        {isShareModalOpen && (
          <div
            onClick={(e) =>
              e.target === e.currentTarget && setIsShareModalOpen(false)
            }
            className="fixed top-0 left-0 right-0 bottom-0 bg-N0/60"
          >
            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 rounded-lg bg-N96 p-8 space-y-6">
              <div className="text-TitleLarge">Address</div>
              <Input
                id="address"
                layout="outlineLabel"
                size="larger"
                inputValue={to}
                setInputValue={setTo}
              />
              <div className="w-full flex flex-row justify-between">
                <Button
                  layout="neutral"
                  size="large"
                  onClick={() => setIsShareModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  layout="primary"
                  size="large"
                  onClick={async () => {
                    // call shareFile method
                    await shareFile();
                  }}
                >
                  send
                </Button>
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
