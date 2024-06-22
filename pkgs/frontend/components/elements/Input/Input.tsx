import {
  ChevronDown20Regular,
  Circle20Regular,
  ErrorCircle20Regular,
} from "@fluentui/react-icons";
import { ChangeEvent, FC, ReactNode, useRef, useState } from "react";

type InputProps = {
  id: string;
  labelVis?: boolean;
  label: string;
  placeholder?: string;
  helperTextVis?: boolean;
  helperText?: string;

  headerIconVis?: boolean;
  headerIcon?: ReactNode;
  fotterIconVis?: boolean;
  fotterIcon?: ReactNode;

  inputValue?: string;
  setInputValue?: any;

  layout?: "outline" | "filledLighter" | "filledDarker";
  disabled?: boolean;
  readOnly?: boolean;
};

const Input: FC<InputProps> = ({
  id,
  labelVis = true,
  label = "Label",
  placeholder = "placeholder",
  helperTextVis = false,
  helperText = "helper text",

  headerIconVis = false,
  headerIcon = <Circle20Regular />,
  fotterIconVis = false,
  fotterIcon = <ChevronDown20Regular />,

  inputValue = "",
  setInputValue = () => { },

  layout = "outline",
  disabled = false,
  readOnly = false,
}) => {
  // const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsFocused(event.target.value !== "");

    setIsError(!isValidInput(event.target.value));
  };

  const isValidInput = (input: string) => {
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(input);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const contentLayout = {
    outline: `outline outline-1 outline-Neutral-Stroke-1-Rest `,
    filledLighter: `bg-Neutral-Background-1-Rest`,
    filledDarker: `bg-Neutral-Background-3-Rest`,
  };

  return (
    <div className={`w-full flex flex-col space-y-2 text-LabelMedium ${readOnly && 'cursor-default'}`}>
      <label htmlFor={id} className={`text-Neutral-Foreground-1-Rest ${labelVis ? 'block' : 'hidden'}`}>{label}</label>
      <div className={`rounded ${disabled ? 'text-Neutral-Foreground-Disabled-Rest' : 'text-Neutral-Foreground-5-Rest'}`}>
        <div onClick={handleClick}
          className={`rounded flex flex-row items-center space-x-5 px-2.5
          ${contentLayout[layout]}
          ${readOnly && isFocused ? 'outline-none outline-offset-0' : isFocused && 'outline outline-1 outline-Primary-Stroke-Compound-Rest'}
          ${isFocused && isError ? 'outline outline-2 outline-Status-Danger-Stroke-1-Rest'
              : isError && 'bg-Status-Danger-Background-2-Rest outline outline-1 outline-Status-Danger-Stroke-1-Rest'}
          `}>
          <div className="grow flex flex-row items-center">
            <div className={`${headerIconVis ? 'block' : 'hidden'}`}>{headerIcon}</div>
            <div className="grow space-x-1 p-2.5">
              <input className={`w-full bg-transparent text-BodyLarge outline-none 
                  ${disabled ?
                  'text-Neutral-Foreground-Disabled-Rest placeholder:text-Neutral-Foreground-Disabled-Rest' :
                  'text-Neutral-Foreground-1-Rest placeholder:text-Neutral-Foreground-5-Rest'}
                  ${readOnly && 'placeholder:text-Neutral-Foreground-1-Rest cursor-default'}`}
                disabled={disabled}
                readOnly={readOnly}
                id={id}
                ref={inputRef}
                onBlur={() => { setIsFocused(false); }}
                onChange={(event) => { handleInputChange(event); }}
                onFocus={() => { setIsFocused(true); }}
                value={inputValue}
                placeholder={placeholder}
              />
            </div>
          </div>
          <div className="flex flex-row space-x-1">
            <div className={`text-Status-Danger-Foreground-1-Rest ${isError ? 'block' : 'hidden'}`}>
              <ErrorCircle20Regular />
            </div>
            <div className={`${fotterIconVis ? 'block' : 'hidden'}`}>{fotterIcon}</div>
          </div>
        </div>
      </div>
      <span className={`break-words ${helperTextVis ? 'block' : 'hidden'} ${isError ? 'text-Status-Danger-Foreground-1-Rest' : 'text-Neutral-Foreground-Variant-Rest'}`}>
        {helperText}
      </span>
    </div>
  );
};

export default Input;