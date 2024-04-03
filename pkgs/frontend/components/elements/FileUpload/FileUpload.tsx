import React, { useState } from "react";

// Propsの型定義
interface FileUploadProps {
  onFileSelect: (file: File) => void; // ファイル選択時のコールバック関数
  uploadFile: (file: File | null) => Promise<void>; // ファイルアップロード時のコールバック関数
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  uploadFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      onFileSelect(file); // 親コンポーネントにファイルを渡す
    }
  };

  const uploadingFile = async () => {
    await uploadFile(selectedFile);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && (
        <div>
          <p>選択されたファイル: {selectedFile.name}</p>
          <button onClick={uploadingFile}>アップロード</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
