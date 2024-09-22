import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import type React from 'react';
import { cookieToInitialState } from 'wagmi';

import { Layout } from '~/lib/layout';
import { RootProviders } from '~/lib/providers/root';
import { config } from '~/lib/utils/wagmi-config';

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'todo-list';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: 'Web3 Task Manager',
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  const initialState = cookieToInitialState(config, headers().get('cookie'));
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <RootProviders initialState={initialState}>
          <Layout>{children}</Layout>
        </RootProviders>
      </body>
    </html>
  );
};

export default RootLayout;
