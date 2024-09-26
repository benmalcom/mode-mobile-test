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
  // eslint-disable-next-line
  console.log('Error:', error);
  const message = 'An error occurred, please refresh browser and try again';
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
      marginTop={{ base: '10px', md: '50px', lg: '80px' }}
      gap={6}
      w={{ base: '95%', md: '250px' }}
      mx={{ base: 'auto', md: '2.5%' }}
    >
      <Flex
        flexDir="column"
        align="center"
        justify="center"
        boxSizing="border-box"
        p={4}
        w="full"
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
            <Heading
              color="black"
              as="h5"
              size="md"
              textAlign="center"
              id="tokenBalance"
            >
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
            px={{ base: 9, md: 4 }}
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
            px={{ base: 9, md: 4 }}
          >
            Burn NFT
          </Button>
        </Flex>
        <Flex h="35px" bg="gray.100" w="full" align="center" px={3} gap={1}>
          <Text color="gray.600">Total NFTs minted: </Text>
          <Text color="purple.800" fontWeight={500}>
            {tokenIds.length}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Portfolio;
