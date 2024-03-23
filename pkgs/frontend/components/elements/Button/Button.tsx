import { ChevronDown16Regular, Circle20Regular } from '@fluentui/react-icons';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    size?: 'medium' | 'large' | 'larger';
    layout?: 'neutral' | 'outline' | 'subtle' | 'transparent' | 'primary';
    headerVisible?: boolean;
    headerIcon?: ReactNode;
    labelVisible?: boolean;
    fotterVisible?: boolean;
    children?: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick, size = 'medium', layout = 'neutral', headerVisible = false, headerIcon=<Circle20Regular />, labelVisible = true, fotterVisible = false, children }) => {
    const buttonSize = {
        medium: 'p-0.5',
        large: 'space-x-0.5 p-1',
        larger: 'space-x-0.5 p-1.5',
    };

    const iconSize = {
        medium: '',
        large: 'p-0.5',
        larger: 'p-0.5',
    };

    const textContainerSize = {
        medium: 'pl-1.5 pr-2 text-LabelSmall',
        large: 'pl-1 pr-1.5 text-LabelSmallProminent',
        larger: 'pl-1 pr-1.5 text-LabelMediumProminent',
    };

    const buttonLayout = {
        neutral: 'bg-N96 border border-N42 text-N16 hover:bg-N90 hover:border-N36 active:bg-N78 active:border-N24 disabled:bg-N88 disabled:border-N58 disabled:text-N16/60',
        outline: 'border border-N42 text-N16 hover:bg-N16/8 hover:border-N42 active:bg-N16/24 active:border-N42 disabled:border-N58 disabled:text-N16/60',
        subtle: 'text-N16 hover:bg-N16/8 active:bg-N16/24 disabled:text-N16/60',
        transparent: 'text-P80 hover:text-P70 active:text-P50 disabled:text-P80',
        primary: 'text-N96 bg-P80 hover:bg-P70 active:bg-P50 disabled:bg-S80 disabled:text-N72',
    };

    return (
        <button onClick={onClick}
            className={`rounded flex flex-row place-items-center transition duration-100 ease-in-out
                        ${buttonSize[size]}
                        ${buttonLayout[layout]}`}>

            <div className={`flex justify-center
                            ${iconSize[size]}
                            ${headerVisible? 'flex' : 'hidden'}
                            `}>
                {headerIcon}
            </div>
            <div className={`${textContainerSize[size]} ${labelVisible ? 'block' : 'hidden'}`}>
                {children}
            </div>
            <div className={`flex justify-center pt-[3px] pb-[1px]
                            ${fotterVisible ? 'flex' : 'hidden'}`}>
                <ChevronDown16Regular />
            </div>
        </button>
    );
};

export default Button;
