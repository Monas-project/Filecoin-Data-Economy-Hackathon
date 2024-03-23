import React, { createContext, useState } from "react";

export const GlobalContext = createContext<any>({});

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

  // 状態と関数をオブジェクトにラップして、プロバイダーに引き渡す
  const global = {
    loading,
    setLoading,
  };

  return (
    <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>
  );
};
