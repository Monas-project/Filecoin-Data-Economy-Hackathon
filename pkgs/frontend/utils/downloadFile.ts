export const downloadFile = (data: string, name: string) => {
  // Base64エンコードされたデータから直接Blobを生成
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "application/octet-stream" });

  // Blobからダウンロード用のURLを生成
  const blobUrl = URL.createObjectURL(blob);

  // 生成したURLを利用してファイルをダウンロード
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();

  // 生成したオブジェクトURLの解放
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};
