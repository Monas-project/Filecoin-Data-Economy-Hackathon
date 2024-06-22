import { FC } from "react";
import VerticalTab, { VerticalTabProps } from "./VerticalTab";

export type VerticalTabListProps = {
    tabs: VerticalTabProps[];
    selectedTab: VerticalTabProps | undefined;
    onTabClick: (tab: VerticalTabProps) => void;
};

const VerticalTabList: FC<VerticalTabListProps> = ({
    tabs,
    selectedTab,
    onTabClick,
}) => {

    return (
        <>
            <div className='min-w-[142px] min-h-full pr-4 py-6 bg-Neutral-Background-2-Rest border-r border-Neutral-Stroke-1-Rest'>
                <div className='flex flex-col'>
                    {tabs.map((tab, index) => (
                        <VerticalTab
                            key={index}
                            isSelected={selectedTab?.label === tab.label}
                            onClick={() => onTabClick(tab)}
                            {...tab}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default VerticalTabList;