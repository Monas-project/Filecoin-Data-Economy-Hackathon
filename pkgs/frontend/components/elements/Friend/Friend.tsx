import React, { FC, ReactNode } from 'react';
import Avatars from '../Avatars/Avatars';
import { ArrowDownload20Regular, Delete20Regular, Key20Regular, MoreVertical16Regular, Share20Regular } from '@fluentui/react-icons';

type FriendProps = {
    name: string;
    info: string;
    children?: ReactNode;
}

const Friend: FC<FriendProps> = ({ name, children, info }) => {

    return (
        <div className='group rounded-lg bg-Neutral-Background-1-Rest hover:bg-Neutral-Background-1-Hover active:bg-Neutral-Background-1-Pressed'>
            <div className='rounded-lg flex flex-row space-x-4 px-6 py-3'>
                <div className='flex flex-row items-center space-x-6'>
                    <Avatars size={48} />
                    <div className='space-y-2'>
                        <span className='flex text-BodyLarge text-Neutral-Foreground-1-Rest'>{name}</span>
                        <div className='flex flex-col text-BodySmall text-Neutral-Foreground-Variant-Rest'>
                            <span>{info}</span>
                            <span>{children}</span>
                        </div>
                    </div>
                </div>
                <div className='min-w-[152px] flex flex-row-reverse items-center text-Neutral-Foreground-1-Rest'>
                    <MoreVertical16Regular />
                    <div className='hidden flex-row space-x-3 pr-5 group-hover:flex'>
                        <ArrowDownload20Regular />
                        <Share20Regular />
                        <Delete20Regular />
                        <Key20Regular />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Friend;
