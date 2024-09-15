'use client';

import { Flex, Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import NavBar from '~/lib/layout/navbar';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex flexDir="column" w="100vw" h="100vh" transition="0.5s ease-out">
      <NavBar />
      <Box flex={1}>{children}</Box>
    </Flex>
  );
};
