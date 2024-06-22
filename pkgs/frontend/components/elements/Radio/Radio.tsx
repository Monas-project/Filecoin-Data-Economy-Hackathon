
import React, { FC, MouseEventHandler } from "react";

type RadioProps = {
    disabled?: boolean;
    isChecked?: boolean;
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Radio: FC<RadioProps> = ({ disabled = false, isChecked = false, label = 'Label', onClick }) => {

    return (
        <>
            <button onClick={onClick} className="group flex flex-row place-items-center space-x-1 cursor-pointer">
                <div className="rounded-full">
                    <div className={`w-fit rounded-full p-1 
                    ${!disabled && isChecked ? 'bg-Primary-Background-Subtle-Rest group-hover:bg-Primary-Background-Subtle-Hover group-active:bg-Primary-Background-Subtle-Pressed'
                            : !disabled && 'bg-Neutral-Background-Subtle-Rest group-hover:bg-Neutral-Background-Subtle-Hover group-active:bg-Neutral-Background-Subtle-Pressed'}`}>
                        <div className={`size-3.5 rounded-full p-1 outline outline-2 -outline-offset-2 
                        ${isChecked && disabled ? 'outline-Primary-Stroke-Disabled-Rest'
                                : isChecked ? 'outline-Primary-Stroke-Compound-Rest'
                                    : disabled ? 'outline-Neutral-Stroke-Disabled-Rest'
                                        : ' outline-Neutral-Stroke-Accessible-Rest'} `}>
                            <div className={`size-1.5 rounded-full 
                            ${isChecked ? 'block' : 'hidden'} 
                            ${disabled ? 'bg-Primary-Foreground-Disabled-Rest' : 'bg-Primary-Foreground-Compound-Rest'}`} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row place-items-center px-1 py-0.5">
                    <span className={`text-LabelSmall 
                        ${disabled ? 'text-Neutral-Foreground-Disabled-Rest' : 'text-Neutral-Foreground-1-Rest'}`}>
                        {label}
                    </span>
                </div>
            </button>


        </>
    );
};

export default Radio;