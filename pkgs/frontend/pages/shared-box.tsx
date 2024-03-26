import Button from "@/components/elements/Button/Button";
import CompoundButton from "@/components/elements/Button/CompoundButton";
import { DocumentIcon, FolderIcon } from "@/components/elements/FileFormatIcon/FileFormatIcon";
import Input from "@/components/elements/Input/Input";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import {
    ArrowDownload20Regular,
    Delete20Regular,
    DocumentArrowUp20Regular,
    FolderAdd20Regular,
    Grid20Filled,
    Key20Regular,
    MailInbox20Filled,
    MoreVertical16Regular,
    Share20Regular,
} from "@fluentui/react-icons";
import { useState } from "react";

export default function SharedBox() {

    const [isGetBoxModalOpen, setIsGetBoxModalOpen] = useState(false);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const fileTableTr = [
        { th: "Name", width: 54 },
        { th: "Owner", width: 13 },
        { th: "Data Modified", width: 13 },
        { th: "", width: 20 },
    ];

    return (
        <LayoutMain>
            <div className="bg-N92 h-full w-full flex flex-col text-N16 overflow-y-auto">
                <div className="w-full flex flex-col space-y-6 px-8 py-6 shadow-Elevation01 sticky top-0 bg-N92">
                    <div className="flex flex-row justify-between">
                        <div className="text-TitleLarge">Shared Box</div>
                        <Button layout="subtle" headerVisible={true} headerIcon={<Grid20Filled />} labelVisible={false}></Button>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row space-x-6">
                            <Button fotterVisible={true}>Type</Button>
                            <Button fotterVisible={true}>People</Button>
                            <Button fotterVisible={true}>Modified</Button>
                        </div>
                        <div className="flex flex-row space-x-6">
                            <Button onClick={() => setIsGetBoxModalOpen(true)} layout="neutral" headerVisible={true} headerIcon={<MailInbox20Filled />}>Get Box</Button>
                        </div>
                    </div>
                </div>
                <div className="w-full grow flex flex-col px-8 py-6 space-y-8">
                    <div className="w-full grow rounded-lg px-6 bg-N96">
                        <table className="w-full inline-block text-left">
                            <thead className="w-full flex flex-row px-4 py-4 border-b border-NV130 text-TitleSmall text-NV60">
                                <tr className="w-full h-fit flex [&_th]:p-0 [&_th]:inline-block space-x-8 [&_th]:font-medium">
                                    {fileTableTr.map((x) => (
                                        <th key={x.th} style={{ width: `${x.width}%` }}>{x.th}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="flex flex-col w-full last:[&>tr]:border-none">
                                <tr onClick={() => setIsSelected(!isSelected)}
                                    className={`w-full flex flex-row pl-8 py-3 space-x-8 border-b border-NV150 text-BodyLarge text-NV10 items-center group 
                                            ${isSelected ? 'bg-N70' : 'bg-N96 hover:bg-N90'}
                                            [&>td]:flex`}>
                                    <td style={{ width: `${fileTableTr[0].width}%` }} className="flex flex-row items-center space-x-6">
                                        <DocumentIcon />
                                        <div>Document01</div>
                                    </td>
                                    <td style={{ width: `${fileTableTr[1].width}%` }}>0x123...576</td>
                                    <td style={{ width: `${fileTableTr[2].width}%` }}>02-09-2023 12:46:39</td>
                                    <td style={{ width: `${fileTableTr[3].width}%` }} className="space-x-5 pr-8 justify-end items-center">
                                        <div className={`space-x-3 flex-row group-hover:flex ${isSelected ? 'flex' : 'hidden'}`}>
                                            <Button layout="subtle" headerVisible={true} headerIcon={<ArrowDownload20Regular />} labelVisible={false}></Button>
                                            <Button layout="subtle" headerVisible={true} headerIcon={<Delete20Regular />} labelVisible={false}></Button>
                                        </div>
                                        <MoreVertical16Regular />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* GetBox Button Dialog */}
                {isGetBoxModalOpen && (
                    <div onClick={(e) => e.target === e.currentTarget && setIsGetBoxModalOpen(false)}
                        className="fixed top-0 left-0 right-0 bottom-0 bg-N0/60"
                    >

                        <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 rounded-lg bg-N96 p-8 space-y-6">
                            <div className="text-TitleLarge">Get Box</div>

                            <Input id="uri" layout="outline" size="larger" label="URI" />

                            <Input id="secretKey" layout="outline" size="larger" label="Secret Key" />

                            <div className="w-full flex flex-row justify-between">
                                <Button layout="neutral" size="large" onClick={() => setIsGetBoxModalOpen(false)}>Close</Button>
                                <Button layout="primary" size="large" >Receive</Button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </LayoutMain>
    );
};
