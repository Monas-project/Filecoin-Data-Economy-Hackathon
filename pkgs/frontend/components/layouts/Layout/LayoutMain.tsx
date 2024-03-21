import { Search } from "@/components/elements/Search/Search";
import { NavigationDrawer } from "../NavigationDrawer/NavigationDrawer";

export default function LayoutMain({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='max-w-full h-screen flex flex-row bg-N84'>
            <NavigationDrawer />
            <div className="w-full flex flex-col">
                <div className="w-full h-1.5 bg-N84" />
                <div className="w-full rounded-tl-lg px-8 py-2.5 bg-N88">
                    <Search />
                </div>
                {children}
            </div>
        </div>
    );
}