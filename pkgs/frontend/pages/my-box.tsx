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
import { useWalletClient } from "wagmi";

const fileTableTr = [
  { th: "Name", width: 54 },
  { th: "Owner", width: 13 },
  { th: "Data Modified", width: 13 },
  { th: "", width: 20 },
];

export default function MyBox() {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [tableDatas, setTableDatas] = useState<TableData[]>();
  const [to, setTo] = useState<any>();

  const globalContext = useContext(GlobalContext);
  const { data: walletClient } = useWalletClient();

  /**
   * uploadFile function
   */
  const uploadFile = async () => {
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree

      // call insert method
      await insertTableData("test", "test");

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
    }
  };

  /**
   * createFolder function
   */
  const createFolder = async () => {
    try {
      globalContext.setLoading(true);
      // TODO call encrypt API from cryptree
      // TODO call ipfs API from cryptree
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
      // TODO call delete API from cryptree

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
  const shareFile = async (cid: any, key: any, fileInfo: any) => {
    try {
      globalContext.setLoading(true);

      console.log("to:", to);
      // call sendNotification method
      await sendNotification(to, cid, key, fileInfo);

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
  const download = async () => {
    try {
      globalContext.setLoading(true);
      // TODO call download API from cryptree

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
      globalContext.setLoading(true);
      try {
        // init contract
        await createContract(walletClient);
        // get all table data
        const datas = await getAllTableData();
        console.log(datas);
        setTableDatas(datas);
      } catch (err) {
        console.error("err", err);
      } finally {
        globalContext.setLoading(false);
      }
    };
    init();
  }, []);

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
                    onClick={uploadFile}
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
                <table className="w-full inline-block text-left">
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
                    {tableDatas?.map((data: TableData, i) => (
                      <tr
                        key={i}
                        onClick={() => setIsSelected(!isSelected)}
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
                          <DocumentIcon />
                          <div>Document01</div>
                        </td>
                        <td style={{ width: `${fileTableTr[1].width}%` }}>
                          0x123...576
                        </td>
                        <td style={{ width: `${fileTableTr[2].width}%` }}>
                          02-09-2023 12:46:39
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
                            <Button
                              layout="subtle"
                              headerVisible={true}
                              headerIcon={<ArrowDownload20Regular />}
                              labelVisible={false}
                              onClick={download}
                            ></Button>
                            <Button
                              onClick={() => setIsShareModalOpen(true)}
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
                    await shareFile("test", "test", "test");
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
