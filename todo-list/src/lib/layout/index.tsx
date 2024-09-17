'use client';

import { Flex, Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import NavBar from '~/lib/layout/navbar';
import { useWeb3Auth } from '~/lib/providers/web3-provider';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { isConnected } = useWeb3Auth();

  const bgColor = isConnected ? '#fff' : 'gray.50';

  return (
    <Flex
      flexDir="column"
      w="100vw"
      h="100vh"
      transition="0.5s ease-out"
      bg={bgColor} // Apply conditional bg color
    >
      <NavBar />
      <Box flex={1} w="1180px" mx="auto">
        {children}
      </Box>
    </Flex>
  );
};
