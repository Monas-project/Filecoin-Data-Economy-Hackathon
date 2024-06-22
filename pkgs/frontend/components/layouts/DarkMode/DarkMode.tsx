import React, { FC, ReactNode, useEffect } from "react";

interface DarkModeProps {
    children?: ReactNode;
};

const DarkMode: FC<DarkModeProps> = ({ children }) => {
    useEffect(() => {
        const applyTheme = (theme: string) => {
            console.log('Applying theme:', theme); // ログ追加
            if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                console.log('dark class added'); // ログ追加
            } else {
                document.documentElement.classList.remove('dark');
                console.log('dark class removed'); // ログ追加
            }
        };

        // 初期テーマの適用
        const savedTheme = localStorage.getItem('theme') || 'system';
        applyTheme(savedTheme);

        // テーマの変更をリッスン
        const mediaQueryListener = (e: MediaQueryListEvent) => {
            if (localStorage.getItem('theme') === 'system') {
                applyTheme('system');
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', mediaQueryListener);

        return () => {
            mediaQuery.removeEventListener('change', mediaQueryListener);
        };
    }, []);

    return <>{children}</>

    return null;
};

export default DarkMode;