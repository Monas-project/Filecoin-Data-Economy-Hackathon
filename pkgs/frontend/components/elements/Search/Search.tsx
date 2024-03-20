import { ChangeEvent, useState } from "react";
import { DismissCircle24Filled, Search24Regular } from "@fluentui/react-icons";

export const Search = () => {

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleClearInput = () => {
        setInputValue('');
    };

    return (
        <div className="w-[840px] h-[38px] rounded-full px-4 bg-N84 border border-N64">
            <div className="h-full space-x-3 flex flex-row items-center text-LabelMedium text-N36">
                <Search24Regular />
                <div className="w-full relative py-2">
                    {!inputValue && (
                        <label
                            className="absolute top-1/2 -translate-y-1/2"
                            htmlFor="searchInput">
                            Search input
                        </label>
                    )}

                    <div className="flex flex-row">
                        <input
                            className="w-full py-2 rounded-md border-none outline-none bg-transparent search-cancel:appearance-none"
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
                            onChange={handleInputChange} />
                        {inputValue && (
                            <button
                                onClick={handleClearInput}
                                className="">
                                <DismissCircle24Filled />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};