import { FC, ReactNode } from "react";
import { Circle20Filled } from "@fluentui/react-icons";


export type VerticalTabProps = {
    disabled?: boolean;
    layout?: 'transparent' | 'subtle';

    iconVis?: boolean;
    icon?: ReactNode;
    label?: string;
    isSelected?: boolean;
    onClick?: () => void;
    content?: ReactNode;
};

const VerticalTab: FC<VerticalTabProps> = ({
    disabled = false,
    layout = "transparent",
    iconVis = false,
    icon = <Circle20Filled />,
    label = 'Label',

    isSelected = false,
    onClick = () => { },
}) => {

    const background = {
        transparent: '',
        subtle: 'bg-Neutral-Background-Subtle-Rest group-hover:bg-Neutral-Background-Subtle-Hover group-active:bg-Neutral-Background-Subtle-Pressed',
    };

    return (
        <>
            <div onClick={onClick} className={`group py-1.5 border-l-2 border-Neutral-Stroke-1-Rest`}>
                <div className={`cursor-pointer pl-2 pr-1 py-1 border-l-2 -ml-0.5
                ${disabled && isSelected ? 'border-Neutral-Stroke-Disabled-Rest'
                        : isSelected ? ' border-Primary-Stroke-1-Rest'
                            : 'border-Neutral-Stroke-1-Rest group-hover:border-Neutral-Stroke-1-Hover group-active:border-Neutral-Stroke-1-Pressed'}`}>
                    <div className={`rounded ${background[layout]}`}>
                        <div className="rounded flex flex-row items-center space-x-0.5 pl-1 pr-2 py-1">
                            <div className={`${iconVis ? 'block' : 'hidden'}`}>
                                {icon}
                            </div>
                            <div className="flex flex-row px-1">
                                <span className={`text-LabelMedium 
                                ${disabled ? ' text-Neutral-Foreground-Disabled-Rest'
                                        : isSelected ? ' text-Neutral-Foreground-1-Rest'
                                            : 'text-Neutral-Foreground-3-Rest group-hover:text-Neutral-Foreground-2-Rest group-active:text-Neutral-Foreground-3-Pressed'}`}>
                                    {label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerticalTab;