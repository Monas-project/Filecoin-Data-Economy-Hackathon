"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Box24Regular,
    BoxCheckmark24Regular,
    PeopleCommunity24Regular,
    Box24Filled,
    BoxCheckmark24Filled,
    PeopleCommunity24Filled,
    MailInbox24Filled,
    MailInbox24Regular,
} from "@fluentui/react-icons";
import { Logomark } from "@/public/Logomark";
import Persona from "@/components/elements/Persona/Persona";
import { useState } from "react";
import { VerticalTabProps } from "@/components/elements/Tabs/VerticalTab";
import ColorTheme from "../Settings/ColorTheme";
import Dialog from "@/components/elements/Dialog/Dialog";

const tabs: VerticalTabProps[] = [
    { label: 'Tab 1', content: <ColorTheme /> },
    { label: 'Tab 2', content: <div></div> },
    { label: 'Tab 3', content: <div></div> },
    { label: 'Tab 4', content: <div></div> },
    { label: 'Tab 5', content: <div></div> },
    { label: 'Tab 6', content: <div></div> },
    { label: 'Tab 7', content: <div></div> },
];

export const NavigationDrawer = () => {
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const pathname = usePathname();

    const navContents = [
        {
            name: "My Box",
            href: "/my-box",
            iconA: Box24Filled,
            iconB: Box24Regular,
        },
        {
            name: "Shared Box",
            href: "/shared-box",
            iconA: BoxCheckmark24Filled,
            iconB: BoxCheckmark24Regular,
        },
        {
            name: "Get Box",
            href: "/get-box",
            iconA: MailInbox24Filled,
            iconB: MailInbox24Regular,
        },
        {
            name: "Friend List",
            href: "/friend-list",
            iconA: PeopleCommunity24Filled,
            iconB: PeopleCommunity24Regular,
        },
    ];

    return (
        <div className="min-w-[240px] h-full flex relative">
            <div className="h-[52px] absolute flex items-center px-6">
                <Logomark height={15} color="#D71768" />
            </div>

            <div className="self-center w-full space-y-4 px-2">
                {navContents.map((item) => (
                    <Link href={item.href} key={item.name} className="flex flex-col">
                        <div
                            className={`rounded 
                            ${pathname === item.href ?
                                    "bg-Primary-Background-1-Rest text-Neutral-Foreground-OnPrimary-Rest" :
                                    "bg-Neutral-Background-Subtle-Rest hover:bg-Neutral-Background-Subtle-Hover active:bg-Neutral-Background-Subtle-Pressed"
                                }`}
                        >
                            <div className="flex flex-row px-2 py-1.5 items-center">
                                <div className={`pr-3
                                ${pathname === item.href ?
                                        "text-Neutral-Foreground-OnPrimary-Rest" :
                                        "text-Neutral-Foreground-4-Rest"}`}>
                                    <div className="flex p-1">
                                        {pathname === item.href ? <item.iconA /> : <item.iconB />}
                                    </div>
                                </div>
                                <span className={`h-fit text-LabelLargeProminent
                                ${pathname === item.href ?
                                        "text-Neutral-Foreground-OnPrimary-Rest" :
                                        "text-Neutral-Foreground-3-Rest"}`}>
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="w-full absolute bottom-0 bg-Neutral-Background-3-Rest">
                <Persona avatarSize={32} primaryText="Montesquieu" onClick={() => setIsSettingsModalOpen(true)} />
            </div>

            {isSettingsModalOpen && (
                <div onClick={(e) => e.target === e.currentTarget && setIsSettingsModalOpen(false)}
                    className="z-10 fixed top-0 left-0 right-0 bottom-0 bg-Neutral-Background-Overlay-Rest"
                >
                    <Dialog
                        NavBarVis={true}
                        tabs={tabs}
                        primaryButtonProps={{ label: 'OK', onClick: () => setIsSettingsModalOpen(false), }}
                        secondaryButtonVis={false}
                    />
                </div>
            )}
        </div>
    );
};
