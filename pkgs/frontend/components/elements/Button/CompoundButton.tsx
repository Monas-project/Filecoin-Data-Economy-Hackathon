import { ChevronDown16Regular, Circle20Regular, FolderZip24Regular, MoreVertical16Regular } from '@fluentui/react-icons';
import React, { FC, ReactNode } from 'react';

type ButtonProps = {
    primaryText: string;
    secondaryText: string;
    size?: 'medium' | 'large' | 'larger';
    layout?: 'neutral' | 'outline' | 'subtle' | 'transparent' | 'primary';
    headerVisible?: boolean;
    headerIcon?: ReactNode;
    labelVisible?: boolean;
    fotterVisible?: boolean;
}

const CompoundButton: FC<ButtonProps> = ({ primaryText, secondaryText, size = 'medium', layout = 'neutral', headerVisible = true, headerIcon = <FolderZip24Regular />, labelVisible = true, fotterVisible = true }) => {
    const buttonSize = {
        medium: 'p-2 space-x-2',
        large: 'p-3 space-x-3',
        larger: 'p-4 space-x-4',
    };

    const iconSize = {
        medium: 'p-2',
        large: 'p-3',
        larger: 'p-3',
    };

    const textContainerSize = {
        medium: 'pl-1.5 pr-2',
        large: 'pl-1 pr-1.5',
        larger: 'pl-1 pr-1.5',
    };

    const buttonLayout = {
        neutral: 'bg-N96 border border-N42 text-N16 hover:bg-N90 hover:border-N36 active:bg-N78 active:border-N24 disabled:bg-N88 disabled:text-N16/60 disabled:border-N58',
        outline: 'border border-N42 text-N16 hover:bg-N16/8 active:bg-N16/24 disabled:text-N16/60 disabled:border-N58',
        subtle: 'text-N16 hover:bg-N16/8 active:bg-N16/24 disabled:text-N16/60',
        transparent: 'text-P80 hover:bg-S100/8 hover:text-P70 active:bg-S100/24 active:text-P50 disabled:text-S80',
        primary: 'bg-P80 text-N96 hover:bg-P70 active:bg-P50 disabled:bg-S80 disabled:text-N72',
    };

    const iconLayout = {
        neutral: 'bg-N96 text-N16',
        outline: 'bg-N96 text-N16',
        subtle: 'bg-N96 text-N16',
        transparent: 'bg-N96 text-P80',
        primary: 'bg-N96 text-P80 group-hover:text-P70 group-active:text-P50',
    };

    const secondaryLayout = {
        neutral: 'text-NV60 group-disabled:text-NV100',
        outline: 'text-NV60 group-disabled:text-NV100',
        subtle: 'text-NV60 group-disabled:text-NV100',
        transparent: 'text-S60 group-disabled:text-S90',
        primary: 'text-NV180 group-disabled:text-NV140',
    };

    return (
        <button className={`rounded flex flex-row place-items-center group
                        ${buttonSize[size]}
                        ${buttonLayout[layout]}`}>

            <div className={`rounded flex justify-center
                            ${iconSize[size]}
                            ${iconLayout[layout]}
                            ${headerVisible? 'flex' : 'hidden'}
                            `}>
                {headerIcon}
            </div>

            <div className={`space-y-1 text-left ${textContainerSize[size]} ${labelVisible ? 'block' : 'hidden'}`}>
                <div className='text-LabelMedium'>{primaryText}</div>
                <div className={`text-BodySmall ${secondaryLayout[layout]}`}>{secondaryText}</div>
            </div>

            <div className={`flex justify-center pt-0.5 ${fotterVisible ? 'flex' : 'hidden'}`}>
                <MoreVertical16Regular />
            </div>
            
        </button>
    );
};

export default CompoundButton;
