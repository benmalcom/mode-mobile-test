import type { Metadata, Viewport } from 'next';
import type React from 'react';

import { Layout } from '~/lib/layout';
import { RootProviders } from '~/lib/providers/root';

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'todo-list';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: 'Todo List for mode mobile',
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
  return (
    <html lang="en">
      <body>
        <RootProviders>
          <Layout>{children}</Layout>
        </RootProviders>
      </body>
    </html>
  );
};

export default RootLayout;
