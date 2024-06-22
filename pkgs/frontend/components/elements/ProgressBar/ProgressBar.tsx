import React, { FC } from 'react';

export type ProgressBarProps = {
    width: number;
}

const ProgressBar: FC<ProgressBarProps> =
    ({
        width,
    }) => {

        return (
            <div className='w-full h-0.5 bg-Neutral-Background-1-Rest'>
                <div style={{ width: `${width}%` }} className='h-full bg-Primary-Stroke-Compound-Rest' />
            </div>
        );
    };

export default ProgressBar;
