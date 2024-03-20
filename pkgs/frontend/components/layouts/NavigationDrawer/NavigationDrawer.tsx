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

export const NavigationDrawer = () => {
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
        <div className="h-full flex bg-N84">
            <div className="h-[57px] absolute flex items-center px-6">
                <Logomark height={15} color="#D71768" />
            </div>

            <div className="self-center px-2 space-y-4">
                {navContents.map((item) => (
                    <Link href={item.href} key={item.name} className="flex rounded">
                        <div
                            className={`rounded p-1.5 ${pathname === item.href ? "bg-P90 text-N96" : "bg-N16/0 text-N20 hover:bg-N16/8 active:bg-N16/24"
                                }`}
                        >
                            <div className="rounded flex flex-row space-x-1.5 items-center">
                                <div className="p-2">
                                    {pathname === item.href ? <item.iconA /> : <item.iconB />}
                                </div>
                                <span className="w-[166px] px-2 text-LabelLargeProminent">
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
