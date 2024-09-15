'use client';

import { Flex } from '@chakra-ui/react';

import { WalletConnector } from '~/lib/pages/home/login/wallet-connector';

export const Home = () => {
  return (
    <Flex w="full" h="full" align="center" justify="center">
      <Flex direction="column" justify="center" gap={4} mb={8} w="644px">
        <WalletConnector />
      </Flex>
    </Flex>
  );
};
