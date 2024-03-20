import { ChevronDown20Regular, Circle20Filled, Circle20Regular, Circle24Filled, ErrorCircle20Regular } from '@fluentui/react-icons';
import React, { ChangeEvent, FC, ReactNode, useState } from 'react';

type InputProps = {
    id: string;
    headerVisible?: boolean;
    headerIcon?: ReactNode;
    label?: string;
    fotterVisible?: boolean;
    fotterIcon?: ReactNode;
    helperTextVis?: boolean;
    helperText?: string;
    size?: 'medium' | 'large' | 'larger';
    layout?: 'outlineLabel' | 'underlineLabel' | 'filledLighterLabel' | 'filledDarkerLabel' | 'outline' | 'underline' | 'filledLighter' | 'filledDarker';
}

const Input: FC<InputProps> = ({ id, headerVisible = false, headerIcon = <Circle20Regular />, label = "Label", fotterVisible = false, fotterIcon = <ChevronDown20Regular />, helperTextVis = false, helperText = "helper text", size = "medium", layout = "outlineLabel" }) => {

    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setIsFocused(event.target.value !== "");
    }

    const contentSize = {
        medium: 'px-1.5 py-0.5',
        large: 'px-2.5 py-1.5',
        larger: 'px-3 py-2',
    };

    const inputSize = {
        medium: `py-2 text-BodySmall ${isFocused || inputValue ? 'pt-4 pb-0' : ''}`,
        large: `py-2.5 text-BodyMedium ${isFocused || inputValue ? 'pt-5 pb-1' : ''}`,
        larger: `py-3.5 text-BodyLarge ${isFocused || inputValue ? 'pt-7 pb-0' : ''}`,
    };

    const labelSize = {
        medium: `pl-4 ${isFocused || inputValue ? 'top0 h-fit pt-0.5' : 'items-center'}`,
        large: `pl-5 ${isFocused || inputValue ? 'top0 h-fit pt-1.5' : 'items-center'}`,
        larger: `pl-5 ${isFocused || inputValue ? 'top0 h-fit pt-2' : 'items-center'}`,
    };

    const contentLayout = {
        outlineLabel: `bg-N96`,
        underlineLabel: ``,
        filledLighterLabel: `bg-N96`,
        filledDarkerLabel: `bg-N88`,
        outline: `bg-N96 `,
        underline: ``,
        filledLighter: `bg-N96`,
        filledDarker: `bg-N88`,
    };


    return (

        <div className='relative w-full flex flex-col space-y-1'>

            <div className={`relative rounded text-N34
                            ${contentLayout[layout]}`}>
                <label className={`absolute flex w-full h-full text-LabelMedium
                                ${labelSize[size]}
                                ${isFocused ? 'text-P80' : 'text-N34'}`}
                    htmlFor={id} >{label}</label>
                <div className={`rounded flex flex-row items-center space-x-6 border border-N54
                                ${contentSize[size]}`}>
                    <div className='flex flex-row items-center w-full space-x-2'>
                        <div className={`${headerVisible ? 'flex' : 'hidden'}`}>{headerIcon}</div>
                        <input
                            onFocus={() => { setIsFocused(true) }}
                            onBlur={() => { setIsFocused(false) }}
                            onChange={(event) => { handleInputChange(event) }}
                            id={id}
                            value={inputValue}
                            className={`w-full bg-transparent outline-none text-N16
                                    ${inputSize[size]}`} />
                    </div>
                    <div className='flex flex-row items-center space-x-1'>
                        {isError ? <ErrorCircle20Regular className=' hidden text-E90' /> : ""}

                        <div className={`${fotterVisible ? 'flex' : 'hidden'}`}>{fotterIcon}</div>
                    </div>
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-[99.5%] h-0.5 rounded-b-full 
                                ${isFocused ? 'bg-P80' : 'bg-N16'}`} />

            </div>
            <span className={`pl-3 text-BodySmall text-N28 ${helperTextVis ? 'block' : 'hidden'}`}>{helperText}</span>
        </div>
    );
};

export default Input;
