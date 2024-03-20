import { DocumentPdf20Filled, DocumentText20Filled, Folder20Filled, FolderZip20Filled, Image20Filled, MoviesAndTv20Filled } from '@fluentui/react-icons';
import React from 'react';

export const DocumentIcon = () => (
    <div className='size-7 rounded flex p-1 bg-[#4151FF] text-[#121747]'>
        <DocumentText20Filled />
    </div>
);

export const PdfIcon = () => (
    <div className='size-7 rounded flex p-1 bg-[#FF4144] text-[#701D1E]'>
        <DocumentPdf20Filled />
    </div>
);

export const ImageIcon = () => (
    <div className='size-7 rounded flex p-1 bg-[#77FF41] text-[#428F24]'>
        <Image20Filled />
    </div>
);

export const FolderIcon = () => (
    <div className='size-7 rounded flex p-1 bg-[#FFEF41] text-[#8F8624]'>
        <Folder20Filled />
    </div>
);

export const MovieIcon = () => (
    <div className='size-7 rounded flex p-1 bg-[#B041FF] text-[#461A66]'>
        <MoviesAndTv20Filled />
    </div>
);

export const ZipFolderIcon = () => (
    <div className='size-7 rounded flex p-1 bg-[#FFA341] text-[#855522]'>
        <FolderZip20Filled />
    </div>
);
