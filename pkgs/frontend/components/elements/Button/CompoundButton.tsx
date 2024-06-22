import { FolderZip24Regular, MoreVertical16Regular } from '@fluentui/react-icons';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

type ButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    layout?: 'neutral' | 'outline' | 'subtle' | 'transparent' | 'primary';
    disabled?: boolean;

    primaryText: string;
    secondaryTextVisible?: boolean;
    secondaryText: string;

    headerVisible?: boolean;    // 左アイコンの表示/非表示
    headerIcon?: ReactNode;
    fotterVisible?: boolean;    // 右アイコンの表示/非表示
    fotterIcon?: ReactNode;
}

const CompoundButton: FC<ButtonProps> =
    ({
        onClick,
        layout = 'neutral',
        disabled = false,

        primaryText,
        secondaryTextVisible = true,
        secondaryText,

        headerVisible = true,
        headerIcon = <FolderZip24Regular />,
        fotterVisible = true,
        fotterIcon = <MoreVertical16Regular />,
    }) => {

        const buttonLayout = {
            neutral: 'text-Neutral-Foreground-1-Rest bg-Neutral-Background-1-Rest outline outline-1 outline-Neutral-Stroke-1-Rest hover:bg-Neutral-Background-1-Hover hover:outline-Neutral-Stroke-1-Hover active:bg-Neutral-Background-1-Pressed active:outline-Neutral-Stroke-1-Pressed disabled:bg-Neutral-Background-Disabled-1-Rest disabled:outline-Neutral-Stroke-Disabled-Rest disabled:text-Neutral-Foreground-Disabled-Rest',
            outline: 'text-Neutral-Foreground-1-Rest bg-Neutral-Background-Subtle-Rest outline outline-1 outline-Neutral-Stroke-1-Rest hover:bg-Neutral-Background-Subtle-Hover hover:outline-Neutral-Stroke-1-Hover active:bg-Neutral-Background-Subtle-Pressed active:outline-Neutral-Stroke-1-Pressed disabled:outline-Neutral-Stroke-Disabled-Rest disabled:text-Neutral-Foreground-Disabled-Rest',
            subtle: 'text-Neutral-Foreground-1-Rest bg-Neutral-Background-Subtle-Rest hover:bg-Neutral-Background-Subtle-Hover  active:bg-Neutral-Background-Subtle-Pressed disabled:text-Neutral-Foreground-Disabled-Rest',
            transparent: 'text-Neutral-Foreground-1-Rest outline outline-1 outline-Primary-Stroke-1-Rest hover:text-Neutral-Foreground-OnPrimary-Rest hover:bg-Primary-Background-2-Hover active:text-Neutral-Foreground-OnPrimary-Rest active:bg-Primary-Background-2-Pressed disabled:text-Primary-Foreground-Disabled-Rest',
            primary: 'text-Neutral-Foreground-OnPrimary-Rest bg-Primary-Background-1-Rest hover:bg-Primary-Background-1-Hover active:bg-Primary-Background-1-Pressed disabled:bg-Primary-Background-Disabled-Rest disabled:text-Neutral-Foreground-Disabled-onPrimary-Rest',
        };

        const secondaryLayout = {
            neutral: 'text-Neutral-Foreground-Variant-Rest group-disabled:text-Neutral-Foreground-Disabled-Variant',
            outline: 'text-Neutral-Foreground-Variant-Rest group-disabled:text-Neutral-Foreground-Disabled-Variant',
            subtle: 'text-Neutral-Foreground-Variant-Rest group-disabled:text-Neutral-Foreground-Disabled-Variant',
            transparent: 'text-Neutral-Foreground-Variant-Rest group-hover:text-Neutral-Foreground-OnPrimary-Variant group-active:text-Neutral-Foreground-OnPrimary-Variant group-disabled:text-Primary-Foreground-Disabled-Variant',
            primary: 'text-Neutral-Foreground-OnPrimary-Variant-Rest group-disabled:text-Neutral-Foreground-Disabled-OnPrimary-Variant',
        };

        return (
            <button onClick={onClick} disabled={disabled} className={`w-full max-w-[255px] rounded group ${buttonLayout[layout]}`}>
                <div className='flex flex-row place-items-center space-x-2 px-3 py-2'>
                    <div className={`rounded flex justify-center p-0.5 bg-Neutral-Background-1-Rest ${headerVisible ? 'flex' : 'hidden'}`}>
                        {headerIcon}
                    </div>

                    <div className={`grow pl-1.5 pr-2 text-left`}>
                        <div className={`text-LabelMedium`}>{primaryText}</div>
                        <div className={`text-BodySmall ${secondaryLayout[layout]} ${secondaryTextVisible ? 'block' : 'hidden'}`}>{secondaryText}</div>
                    </div>

                    <div className={`flex justify-center pt-0.5 ${fotterVisible ? 'flex' : 'hidden'}`}>
                        {fotterIcon}
                    </div>
                </div>
            </button>
        );
    };

export default CompoundButton;
