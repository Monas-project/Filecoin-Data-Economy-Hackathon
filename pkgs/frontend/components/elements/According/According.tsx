import { ChevronDown20Regular, ChevronLeft20Regular, ChevronRight20Regular, Circle20Regular } from '@fluentui/react-icons';
import React, { FC, ReactNode, useState } from 'react';

type AccordingProps = {
    label: string;
    iconVis?: boolean;
    icon?: ReactNode;
    chevronPosition?: 'left' | 'right';
    children: ReactNode;
}

const According: FC<AccordingProps> = ({
    label = 'Labell',
    iconVis = false,
    icon = <Circle20Regular />,
    chevronPosition = 'left',
    children
}) => {

    const [isExpand, setIsExpand] = useState(false);

    const handleOpenChildren = () => {
        setIsExpand(!isExpand);
    }

    return (
        <>
            <div className='w-full flex flex-col'>
                <div onClick={handleOpenChildren} className='cursor-pointer flex flex-row space-x-4 text-Neutral-Foreground-1-Rest hover:text-Neutral-Foreground-1-Hover active:text-Neutral-Foreground-1-Pressed'>
                    <div className='flex flex-row space-x-2 place-items-center'>
                        <div className='flex flex-row space-x-2 place-items-center'>
                            <div className={`flex ${chevronPosition == 'left' ? 'block' : 'hidden'}`}>{isExpand ? <ChevronDown20Regular /> : <ChevronRight20Regular />}</div>
                            <div className={`flex ${iconVis ? 'block' : 'hidden'}`}>{icon}</div>
                        </div>
                        <span className='max-w-full hyphens-auto text-TitleMedium'>{label}</span>
                    </div>
                    <div className={`flex ${chevronPosition == 'left' ? 'hidden' : 'block'}`}>{isExpand ? <ChevronDown20Regular /> : <ChevronLeft20Regular />}</div>
                </div>
                <div className={`pl-6 py-3 ${isExpand ? 'block' : 'hidden'}`}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default According;
