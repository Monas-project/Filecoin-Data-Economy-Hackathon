import Radio from "@/components/elements/Radio/Radio";
import { FC, useEffect, useState } from "react";

type Theme = 'system' | 'light' | 'dark';

const ColorTheme: FC = () => {

    const [theme, setTheme] = useState<Theme>(localStorage.theme || 'system');

    const handleChange = (value: Theme) => {
        setTheme(value);
        localStorage.setItem('theme', value);
        if (value === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (value === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.toggle('dark',
                window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
    };

    return (
        <>
            <div className="flex flex-col space-y-3 py-8">
                <span className="text-TitleMedium text-Neutral-Foreground-Variant-Rest">Color Theme</span>
                <div className="flex flex-col space-y-2.5 py-2">
                    <Radio
                        label="Light"
                        isChecked={theme === 'light'}
                        onClick={() => handleChange('light')}
                    />
                    <Radio
                        label="Dark"
                        isChecked={theme === 'dark'}
                        onClick={() => handleChange('dark')}
                    />
                    <Radio
                        label="System"
                        isChecked={theme === 'system'}
                        onClick={() => handleChange('system')}
                    />
                </div>
            </div>
        </>
    );
};

export default ColorTheme;