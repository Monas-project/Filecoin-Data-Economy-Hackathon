import { FC } from "react";

type AvatarsProps = {
    size: 16 | 20 | 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64 | 72 | 96 | 120 | 128;
}

const Avatars: FC<AvatarsProps> = ({ size }) => {
    return (
        <>
            <div
                style={{ minWidth: size, minHeight: size, }}
                className={`aspect-square rounded-full block bg-AvatarsImage bg-contain`} />
        </>
    );
};

export default Avatars;