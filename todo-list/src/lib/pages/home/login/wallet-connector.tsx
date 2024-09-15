import { Flex, Button, Heading, Text, Image } from '@chakra-ui/react';
import type React from 'react';

export const WalletConnector: React.FC = () => {
  return (
    <Flex w="full" h="full" bg="purple.50" align="center" justify="center">
      <Flex flexDir="column" gap={3} align="center" pb={8} h="400px" w="644px">
        <Heading as="h3" size="xl">
          Web3 Task Manager
        </Heading>
        <Text fontSize="18px" textAlign="center">
          Welcome to your Task Manager powered by Metamask, to see your asset
          balance and manage your tasks, login below.
        </Text>
        <Button
          mt={4}
          leftIcon={<Image src="/SVG_MetaMask_Icon_Color.svg" h="25px" />}
          onClick={undefined}
          colorScheme="purple"
        >
          Connect Metamask
        </Button>
      </Flex>
    </Flex>
  );
};
