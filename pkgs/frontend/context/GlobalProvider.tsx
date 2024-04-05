import React, { createContext, useState, Context } from "react";

// GlobalContextの型を定義します。
interface GlobalContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  accessToken: string | undefined;
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  rootId: string | undefined;
  setRootId: React.Dispatch<React.SetStateAction<string | undefined>>;
  rootKey: string | undefined;
  setRootKey: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentNodeCid: string | undefined;
  setCurrentNodeCid: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentNodeKey: string | undefined;
  setCurrentNodeKey: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const defaultGlobalContextValue: GlobalContextType = {
  loading: false,
  setLoading: () => {}, // setStateの型に基づいてダミー関数を定義
  accessToken: undefined,
  setAccessToken: () => {}, // 同上
  rootId: undefined,
  setRootId: () => {},
  rootKey: undefined,
  setRootKey: () => {},
  currentNodeCid: undefined,
  setCurrentNodeCid: () => {},
  currentNodeKey: undefined,
  setCurrentNodeKey: () => {},
};

export const GlobalContext: Context<GlobalContextType> =
  createContext<GlobalContextType>(defaultGlobalContextValue);

/**
 * GlobalProvider
 * @param param0
 * @returns
 */
export const GlobalProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [rootId, setRootId] = useState<string | undefined>(undefined);
  const [rootKey, setRootKey] = useState<string | undefined>(undefined);
  const [currentNodeCid, setCurrentNodeCid] = useState<string | undefined>(
    undefined
  );
  const [currentNodeKey, setCurrentNodeKey] = useState<string | undefined>(
    undefined
  );

  // 状態と関数をオブジェクトにラップして、プロバイダーに引き渡す
  const global = {
    loading,
    setLoading,
    accessToken,
    setAccessToken,
    rootId,
    setRootId,
    rootKey,
    setRootKey,
    currentNodeCid,
    setCurrentNodeCid,
    currentNodeKey,
    setCurrentNodeKey,
  };

  return (
    <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>
  );
};
