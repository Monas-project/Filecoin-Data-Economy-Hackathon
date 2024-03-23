import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Input/Input";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import { CheckboxUnchecked24Regular, MailInbox20Filled } from "@fluentui/react-icons";
import { useState } from "react";

export default function GetBox() {

    const [isGetBoxModalOpen, setIsGetBoxModalOpen] = useState(false);


    return (
        <LayoutMain>
            <div className="bg-N92 h-full w-full flex flex-col text-N16 overflow-y-auto">
                <div className="w-full h-full">
                    <div className="w-full py-6 px-8 sticky top-0 bg-N92 shadow-Elevation01">
                        <div className="text-TitleLarge">Get Box</div>

                        <div className="flex flex-row justify-between pt-8">
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

                    <div className="px-8 py-6">
                        <table className="w-full">
                            <tbody className="space-y-4">
                                <tr className="overflow-hidden w-full rounded-lg flex flex-col bg-N96 border border-N42
                                                [&>td]:flex [&>td]:px-2.5 [&>td]:py-3.5">
                                    <td className="flex-row space-x-3 border-b border-N42">
                                        <CheckboxUnchecked24Regular />
                                        <div className="w-full text-TitleLarge">Monas</div>
                                    </td>
                                    <td className="flex-col space-y-3 text-BodyLarge [&>div]:flex [&>div]:flex-row">
                                        <div className="space-x-2">
                                            <div>CID :</div>
                                            <div>aaaaaaaa</div>
                                        </div>
                                        <div className="space-x-2">
                                            <div>Key :</div>
                                            <div>bbbbbbbbbb</div>
                                        </div>
                                        <div className="space-x-2">
                                            <div>File Info :</div>
                                            <div>ccccccccccc</div>
                                        </div>
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
