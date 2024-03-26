import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Input/Input";
import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import { CheckboxUnchecked24Regular, MailInbox20Filled } from "@fluentui/react-icons";
import { useState } from "react";

export default function GetBox() {

    return (
        <LayoutMain>
            <div className="bg-N92 h-full w-full flex flex-col text-N16 overflow-y-auto">
                <div className="w-full h-full">
                    <div className="flex  flex-col space-y-6 px-8 py-6 shadow-Elevation01 sticky top-0 bg-N92">

                        <div className="text-TitleLarge">Get Box</div>

                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row space-x-6">
                                <Button fotterVisible={true}>Type</Button>
                                <Button fotterVisible={true}>People</Button>
                                <Button fotterVisible={true}>Modified</Button>
                            </div>
                            <div className="flex flex-row space-x-6">

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
            </div>
        </LayoutMain>
    );
};
