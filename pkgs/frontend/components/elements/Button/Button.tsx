import { ChevronDown16Regular, Circle20Regular } from '@fluentui/react-icons';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

export type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    layout?: 'neutral' | 'outline' | 'subtle' | 'transparent' | 'primary';
    disabled?: boolean;

    labelVisible?: boolean;
    label?: string;

    headerVisible?: boolean; // 左アイコンの表示/非表示
    headerIcon?: ReactNode;
    fotterVisible?: boolean; // 右アイコンの表示/非表示
    footerIcon?: ReactNode;
}

const Button: FC<ButtonProps> =
    ({
        onClick,
        layout = 'neutral',
        disabled = false,

        labelVisible = true,
        label = 'Label',

        headerVisible = false,
        headerIcon = <Circle20Regular />,
        fotterVisible = false,
        footerIcon = <ChevronDown16Regular />,
    }) => {

        const disabledLayout = {
            neutral: 'bg-Neutral-Background-Disabled-1-Rest text-Neutral-Foreground-Disabled-Rest outline outline-1 outline-Neutral-Stroke-Disabled-Rest',
            outline: 'text-Neutral-Foreground-Disabled-Rest outline outline-1 outline-Neutral-Stroke-Disabled-Rest',
            subtle: 'text-Neutral-Foreground-Disabled-Rest',
            transparent: 'text-Primary-Foreground-Disabled-Rest outline outline-1 Primary-Stroke-Disabled-Rest',
            primary: 'bg-Primary-Background-Disabled-Rest text-Neutral-Foreground-Disabled-OnPrimary-Rest',
        };

        const enabledLayout = {
            neutral: 'bg-Neutral-Background-1-Rest hover:bg-Neutral-Background-1-Hover active:bg-Neutral-Background-1-Pressed text-Neutral-Foreground-1-Rest outline outline-1 outline-Neutral-Stroke-1-Rest hover:outline-Neutral-Stroke-1-Hover active:outline-Neutral-Stroke-1-Pressed',
            outline: 'bg-Neutral-Background-Subtle-Rest hover:bg-Neutral-Background-Subtle-Hover active:bg-Neutral-Background-Subtle-Pressed text-Neutral-Foreground-1-Rest outline outline-1 outline-Neutral-Stroke-1-Rest hover:outline-Neutral-Stroke-1-Hover active:outline-Neutral-Stroke-1-Pressed',
            subtle: 'bg-Neutral-Background-Subtle-Rest hover:bg-Neutral-Background-Subtle-Hover active:bg-Neutral-Background-Subtle-Pressed text-Neutral-Foreground-1-Rest',
            transparent: 'hover:bg-Primary-Background-2-Hover active:bg-Primary-Background-2-Pressed text-Neutral-Foreground-1-Rest hover:text-Neutral-Foreground-OnPrimary-Rest active:text-Neutral-Foreground-OnPrimary-Rest outline outline-1 outline-Primary-Stroke-1-Rest',
            primary: 'bg-Primary-Background-1-Rest hover:bg-Primary-Background-1-Hover active:bg-Primary-Background-1-Pressed text-Neutral-Foreground-OnPrimary-Rest',
        };

        return (
            <button onClick={onClick} disabled={disabled}
                className={`select-none rounded flex flex-row place-items-center transition duration-100 ease-in-out 
                ${disabled ? disabledLayout[layout] : enabledLayout[layout]} 
                ${disabled && 'cursor-not-allowed'}`}>
                <div className='rounded p-1.5 flex flex-row '>
                    <div className={`flex justify-center size-5 ${headerVisible ? 'flex' : 'hidden'}`}>
                        {headerIcon}
                    </div>
                    <div className={`px-1 py-0.5 text-LabelSmall ${labelVisible ? 'block' : 'hidden'}`}>
                        {label}
                    </div>
                    <div className={`pr-0.5 py-0.5 ${fotterVisible ? 'flex' : 'hidden'}`}>
                        {footerIcon}
                    </div>
                </div>
            </button>
        );
    };

export default Button;
