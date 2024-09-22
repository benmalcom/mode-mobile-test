import {
  Flex,
  Button,
  Heading,
  Text,
  Skeleton,
  Stack,
  useToast,
} from '@chakra-ui/react';
import type React from 'react';
import { GiBurningBlobs } from 'react-icons/gi';
import { MdOutlineCreateNewFolder } from 'react-icons/md';

import { usePortfolio } from '~/lib/hooks/usePortfolio';
import { formatBalance } from '~/lib/utils/formatters';

type PortfolioProps = {
  isTwoCompleted?: boolean;
};

// Utility function to display toast notifications
const showToast = (
  toast: ReturnType<typeof useToast>,
  description: string,
  status: 'success' | 'error',
  duration: number = 5000
) => {
  toast({ description, status, duration });
};

// Utility function for handling errors
const handleError = (
  toast: ReturnType<typeof useToast>,
  error: Error | unknown
) => {
  const message =
    error instanceof Error
      ? error.message
      : 'An error occurred, please refresh browser and try again';
  showToast(toast, message, 'error', 10000);
};

export const Portfolio: React.FC<PortfolioProps> = ({ isTwoCompleted }) => {
  const toast = useToast();

  const {
    tokenBalance,
    tokenBalanceLoading,
    tokenBalanceError,
    mintNft,
    tokenIds,
    isMintPending,
    isMintConfirming,
    isBurnPending,
    isBurnConfirming,
    burnNft,
  } = usePortfolio({
    onMintSuccess: () => showToast(toast, 'NFT mint successful!', 'success'),
    onBurnSuccess: () => showToast(toast, 'Token burn successful!', 'success'),
    onMintError: (error) => handleError(toast, error),
    onBurnError: (error) => handleError(toast, error),
  });

  return (
    <Flex
      flexDir="column"
      position="sticky"
      zIndex={5}
      marginTop="80px"
      gap={6}
    >
      <Flex
        flexDir="column"
        align="center"
        justify="center"
        boxSizing="border-box"
        p={4}
        w="250px"
        h="fit-content"
        rounded="md"
        border="3px dashed"
        borderColor="gray.400"
        borderWidth="3px"
        gap={2}
      >
        <Text color="gray.500">Your Balance</Text>
        <Skeleton isLoaded={!tokenBalanceLoading} height="40px" width="150px">
          {tokenBalanceError && !tokenBalanceLoading && (
            <Text color="red.500" textAlign="center" fontSize="sm">
              Error fetching balance
            </Text>
          )}
          {tokenBalance && (
            <Heading color="black" as="h5" size="md" textAlign="center">
              {formatBalance(tokenBalance)}
            </Heading>
          )}
        </Skeleton>
      </Flex>
      <Stack w="full" spacing={4}>
        <Flex w="full" justify="space-between">
          <Button
            variant="custom"
            rounded="3xl"
            leftIcon={<MdOutlineCreateNewFolder />}
            iconSpacing={1}
            onClick={mintNft}
            isDisabled={!isTwoCompleted || isMintPending || isMintConfirming}
            isLoading={isMintPending || isMintConfirming}
            loadingText="Minting"
          >
            Mint NFT
          </Button>
          <Button
            colorScheme="red"
            rounded="3xl"
            leftIcon={<GiBurningBlobs />}
            iconSpacing={1}
            variant="outline"
            isLoading={isBurnPending || isBurnConfirming}
            isDisabled={
              isBurnConfirming || isBurnPending || Boolean(!tokenIds.length)
            }
            onClick={burnNft}
            loadingText="Burning..."
          >
            Burn NFT
          </Button>
        </Flex>
        <Flex h="35px" bg="gray.100" w="full" align="center" px={3} gap={1}>
          <Text color="gray.600">Total NFTs minted: </Text>
          <Text color="gray.800">{tokenIds.length}</Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Portfolio;
