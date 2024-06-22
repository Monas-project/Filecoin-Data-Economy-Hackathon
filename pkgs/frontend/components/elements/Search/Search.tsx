import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DismissCircle20Filled, Search20Regular } from "@fluentui/react-icons";

export const Search = () => {

    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleClearInput = () => {
        setInputValue('');
    };

    const handleInputFocus = () => {
        if (searchInputRef.current) {
            (searchInputRef.current as any).focus();
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        if (searchInputRef.current) {
            (searchInputRef.current as any).addEventListener('focus', handleFocus);
            (searchInputRef.current as any).addEventListener('blur', handleBlur);
        }

        return () => {
            if (searchInputRef.current) {
                (searchInputRef.current as any).removeEventListener('focus', handleFocus);
                (searchInputRef.current as any).removeEventListener('blur', handleBlur);
            }
        };
    }, []);

    return (
        <div
            onClick={handleInputFocus}
            className={`max-w-[840px] rounded-full px-1 flex flex-row items-center bg-Neutral-Background-4-Rest box-border outline outline-1
        ${isFocused ? 'outline-Primary-Stroke-Compound-Rest' : 'outline-transparent'}`}>
            <div className="grow space-x-2 pr-2 flex flex-row items-center text-LabelMedium">
                <div className={`min-w-8 size-8 flex place-items-center justify-center
                ${isFocused ? ' text-Primary-Foreground-1-Rest' : ' text-Neutral-Foreground-5-Rest'}`}>
                    <Search20Regular />
                </div>
                <input
                    ref={searchInputRef}
                    className="w-full py-1.5 border-none outline-none bg-transparent search-cancel:appearance-none
                     text-LabelMedium text-Neutral-Foreground-1-Rest placeholder:text-Neutral-Foreground-5-Rest"
                    aria-invalid="false"
                    autoComplete="off"
                    id="searchInput"
                    type="search"
                    aria-autocomplete="list"
                    aria-expanded="false"
                    autoCapitalize="none"
                    spellCheck="false"
                    role="combobox"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Search input" />
            </div>
            {inputValue && (
                <button
                    onClick={handleClearInput}
                    className={`size-8 flex place-items-center justify-center
                    ${isFocused ? 'text-Primary-Foreground-1-Rest' : 'text-Neutral-Foreground-5-Rest'}`}>
                    <DismissCircle20Filled />
                </button>
            )}
        </div>
    );
};