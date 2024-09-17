import {
  Flex,
  Button,
  Heading,
  Text,
  Image,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  AlertTitle,
  Box,
  Link,
} from '@chakra-ui/react';
import type React from 'react';

import { useWeb3Auth } from '~/lib/providers/web3-provider';

export const WalletConnector: React.FC = () => {
  const { connect, isConnecting, errorMessage, clearError } = useWeb3Auth();

  const handleConnect = () => connect();

  return (
    <Flex w="full" h="full" align="center" justify="center">
      <Flex
        flexDir="column"
        gap={3}
        pb={8}
        h="400px"
        w="600px"
        justify="center"
        align="center"
      >
        <Heading as="h4" size="2xl" color="purple.900" textAlign="center">
          Your Web3 Task Manager
        </Heading>
        <Text fontSize="15px" color="gray.600" opacity={0.8} textAlign="center">
          {' '}
          Manage your tasks efficiently while keeping track of your crypto
          assets all in one place. Log in with your MetaMask wallet to view your
          asset balance, assign tasks, set deadlines, and stay organized in the
          Web3 space.
        </Text>{' '}
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Connect error!</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Box>

            <CloseButton
              alignSelf="flex-start"
              position="absolute"
              right={0}
              top={0}
              onClick={clearError}
            />
          </Alert>
        )}
        <Button
          mt={6}
          leftIcon={<Image src="/SVG_MetaMask_Icon_Color.svg" h="25px" />}
          onClick={handleConnect}
          colorScheme="purple"
          isDisabled={isConnecting}
          isLoading={isConnecting}
          loadingText={isConnecting ? 'Connecting...' : undefined}
          w="fit-content"
        >
          Connect Metamask
        </Button>
        <Link color="#fff">Learn more</Link>
      </Flex>
    </Flex>
  );
};
