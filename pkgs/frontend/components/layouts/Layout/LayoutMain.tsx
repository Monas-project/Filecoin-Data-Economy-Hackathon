import { Search } from "@/components/elements/Search/Search";
import { NavigationDrawer } from "../NavigationDrawer/NavigationDrawer";

export default function LayoutMain({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='max-w-full h-screen flex flex-row bg-Neutral-Background-4-Rest'>
            <NavigationDrawer />
            <div className="w-full flex flex-col">
                <div className="w-full min-h-1.5 bg-Neutral-Background-4-Rest" />
                <div className="w-full rounded-tl-lg p-2 bg-Neutral-Background-3-Rest">
                    <Search />
                </div>
                {children}
            </div>
        </div>
    );
}