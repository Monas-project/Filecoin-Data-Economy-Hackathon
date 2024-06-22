import React, { FC, ReactNode, useState } from 'react';
import Button, { ButtonProps } from '../Button/Button';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { VerticalTabProps } from '../Tabs/VerticalTab';
import VerticalTabList from '../Tabs/VerticalTabList';

type DialogProps = {
    NavBarVis?: boolean;
    tabs?: VerticalTabProps[];
    dismissVis?: boolean;
    
    primaryButtonVis?: boolean;
    primaryButtonProps?: ButtonProps;

    secondaryButtonVis?: boolean;
    secondaryButtonProps?: ButtonProps;

    tertiaryButtonVis?: boolean;
    tertiaryButtonProps?: ButtonProps;

    children?: ReactNode;
};

const Dialog: FC<DialogProps> = ({
    NavBarVis = false,
    tabs,
    dismissVis = false,

    primaryButtonVis = true,
    primaryButtonProps,

    secondaryButtonVis = true,
    secondaryButtonProps,

    tertiaryButtonVis = false,
    tertiaryButtonProps,

    children,
}) => {
    const [selectedTab, setSelectedTab] = useState<VerticalTabProps | undefined>(tabs?.[0]);

    const handleTabClick = (tab: VerticalTabProps) => {
        setSelectedTab(tab);
    };

    return (
        <>
            <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-fit rounded-lg flex flex-col overflow-hidden bg-Neutral-Background-1-Rest shadow-Elevation06-Light dark:shadow-Elevation06-Dark'>
                <div className='flex flex-row'>
                    <div className={`${NavBarVis ? 'block' : 'hidden'}`}>
                        {tabs && (
                            <VerticalTabList
                                tabs={tabs}
                                selectedTab={selectedTab}
                                onTabClick={handleTabClick}
                            />
                        )}
                    </div>
                    <div className='min-w-[500px] px-6 pt-2 bg-Neutral-Background-1-Rest pb-4'>
                        {NavBarVis ? selectedTab?.content : children}
                    </div>
                </div>
                {/* Footer */}
                <div className='flex flex-row-reverse justify-between p-4 bg-Neutral-Background-2-Rest border-t border-Neutral-Stroke-1-Rest'>
                    <div className='flex flex-row space-x-4'>
                        <div className={`${primaryButtonVis ? 'block' : 'hidden'}`}><Button layout='primary' {...primaryButtonProps} /></div>
                        <div className={`${tertiaryButtonVis ? 'block' : 'hidden'}`}><Button layout='outline' {...tertiaryButtonProps} /></div>
                    </div>
                    <div className={`${secondaryButtonVis ? 'block' : 'hidden'}`}><Button layout='outline' {...secondaryButtonProps} /></div>
                </div>
                <div className={`absolute top-4 right-4 ${dismissVis ? 'block' : 'hidden'}`}><Button layout='subtle' headerVisible={true} headerIcon={<Dismiss20Regular />} /></div>
            </div>
        </>
    );
};

export default Dialog;