import { Settings20Filled } from "@fluentui/react-icons";
import { FC, MouseEventHandler, ReactNode } from "react";
import Avatars from "../Avatars/Avatars";
import Button from "../Button/Button";

type PersonaProps = {
    layout?: 'TextAfter' | 'TextBefore' | 'TextBelow';
    alignment?: 'Center' | 'Start';
    avatarSize: 56 | 40 | 36 | 32 | 28 | 20;
    primaryText: string;

    secondaryTextVisible?: boolean;
    secondaryText?: string;
    tertiaryTextVisible?: boolean;
    tertiaryText?: string;
    quaternaryTextVisible?: boolean;
    quaternaryText?: string;

    icon?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Persona: FC<PersonaProps> =
    ({ layout = 'TextAfter',
        alignment = 'Center',
        avatarSize = 32,
        primaryText = "Primary Text",
        secondaryTextVisible = false,
        secondaryText = "Secondary Text",
        tertiaryTextVisible = false,
        tertiaryText = "Tertiary Text",
        quaternaryTextVisible = false,
        quaternaryText = "Quaternary Text",

        icon = <Button layout="subtle" headerVisible={true} headerIcon={<Settings20Filled />} labelVisible={false} />,
        onClick,
    }) => {

        const contentPadding = {
            56: "px-3 py-3",
            40: "px-3 py-3",
            36: "px-2.5 py-3",
            32: "px-2 py-2.5",
            28: "px-1.5 py-2",
            20: "px-1 py-1.5",
        }

        const contentLayout = {
            'TextAfter': 'flex-row',
            'TextBefore': 'flex-row-reverse',
            'TextBelow': 'flex-col',
        }
        const verticalLayout = {
            'TextAfter': 'flex-row',
            'TextBefore': 'flex-row-reverse',
            'TextBelow': 'flex-row',
        }

        const defaultSubText = "text-BodySmall";
        const subText = {
            56: "text-BodyMedium",
            40: defaultSubText,
            36: defaultSubText,
            32: defaultSubText,
            28: defaultSubText,
            20: defaultSubText,
        }

        const primaryTextLayout = {
            56: "text-LabelLargeProminent",
            40: "text-LabelLargeProminent",
            36: "text-LabelMediumProminent",
            32: "text-LabelMediumProminent",
            28: "text-LabelMedium",
            20: "text-LabelMedium",
        }

        const moreVertical = {
            'Center': "place-items-center",
            'Start': "place-items-start",
        }

        return (
            <>
                <div className={`w-full p-3 ${contentPadding[avatarSize]}`}>
                    <div
                        className={`w-full flex space-x-3
                ${contentLayout[layout]}`}>
                        <Avatars size={avatarSize} />
                        <div
                            className={`w-full flex justify-between
                    ${verticalLayout[layout]}`}>
                            <div className="w-full [&_span]:hyphens-auto flex flex-col justify-center">
                                <span
                                    className={`w-full text-Neutral-Foreground-1-Rest
                                ${primaryTextLayout[avatarSize]}`}>
                                    {primaryText}
                                </span>
                                {secondaryTextVisible &&
                                    <div className={`pt-0.5 text-Neutral-Foreground-2-Rest
                                ${subText[avatarSize]}`}>
                                        <span>{secondaryText}</span>
                                        {tertiaryTextVisible &&
                                            <div className="flex flex-col">
                                                <span>{tertiaryText}</span>
                                                {quaternaryTextVisible && <span>{quaternaryText}</span>}
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <div className={`pl-0.5 py-0.5 flex ${moreVertical[alignment]}`}>
                                <Button onClick={onClick} layout="subtle" labelVisible={false} headerVisible={true} headerIcon={icon} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

export default Persona;