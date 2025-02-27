'use client';
import './globals.css';
import '@/nprogress.css';
import './i18n';
import React, { useLayoutEffect } from 'react';
import LeftSide from '@/components/leftSide';
import { CssVarsProvider, ThemeProvider } from '@mui/joy/styles';
import { useColorScheme } from '@/lib/mui';
import { joyTheme } from '@/defaultTheme';
import TopProgressBar from '@/components/topProgressBar';
import DialogueContext, { useDialogueContext } from './context/dialogue';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

function CssWrapper({ children }: { children: React.ReactElement }) {
  const { i18n } = useTranslation();
  const { mode } = useColorScheme();
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref?.current && mode) {
      ref?.current?.classList?.add(mode);
      if (mode === 'light') {
        ref?.current?.classList?.remove('dark');
      } else {
        ref?.current?.classList?.remove('light');
      }
    }
  }, [ref, mode]);
  useLayoutEffect(() => {
    i18n.changeLanguage(window.localStorage.getItem('db_gpt_lng') || 'en');
  }, []);

  return (
    <div ref={ref} className="h-full">
      <TopProgressBar />
      <DialogueContext>{children}</DialogueContext>
    </div>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isContract, isMenuExpand } = useDialogueContext();

  return (
    <>
      <div
        className={classNames(
          'grid h-full w-full grid-cols-1 grid-rows-[auto,1fr] text-smd dark:text-gray-300 md:grid-rows-[1fr] transition-width duration-500',
          {
            'md:grid-cols-[280px,1fr]': isMenuExpand,
            'md:grid-cols-[60px,1fr]': !isMenuExpand,
          },
        )}
      >
        <LeftSide />
        <div
          className={classNames('flex flex-col flex-1 relative overflow-hidden px-3', {
            'w-[calc(100vw - 76px)]': isContract,
          })}
        >
          {children}
        </div>
      </div>
    </>
  );
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full font-sans">
      <body className={`h-full font-sans`}>
        <ThemeProvider theme={joyTheme}>
          <CssVarsProvider theme={joyTheme} defaultMode="light">
            <CssWrapper>
              <div className={`contents h-full`}>
                <LayoutWrapper>{children}</LayoutWrapper>
              </div>
            </CssWrapper>
          </CssVarsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
