import { DocumentPdf20Filled, DocumentText20Filled, Folder20Filled, FolderZip20Filled, Image20Filled, MoviesAndTv20Filled } from '@fluentui/react-icons';
import React, { FC } from 'react';

type FileFormatIconProps = {
    fileType: 'DocumentIcon' | 'PdfIcon' | 'ImageIcon' | 'FolderIcon' | 'MovieIcon' | 'ZipFolderIcon';
};

const FileFormatIcon: FC<FileFormatIconProps> = ({ fileType }) => {

    const bgTextColor = {
        'DocumentIcon': 'bg-[#4151FF] text-[#121747]',
        'PdfIcon': 'bg-[#FF4144] text-[#701D1E]',
        'ImageIcon': 'bg-[#77FF41] text-[#428F24]',
        'FolderIcon': 'bg-[#FFEF41] text-[#8F8624]',
        'MovieIcon': 'bg-[#B041FF] text-[#461A66]',
        'ZipFolderIcon': 'bg-[#FFA341] text-[#855522]',
    };

    const icons = {
        'DocumentIcon': <DocumentText20Filled />,
        'PdfIcon': <DocumentPdf20Filled />,
        'ImageIcon': <Image20Filled />,
        'FolderIcon': <Folder20Filled />,
        'MovieIcon': <MoviesAndTv20Filled />,
        'ZipFolderIcon': <FolderZip20Filled />,
    };

    return (
        <div className={`size-7 rounded flex p-1 ${bgTextColor[fileType]}`}>
            {icons[fileType]}
        </div>
    );
};

export default FileFormatIcon;