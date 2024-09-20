import { Flex, Button, Heading, Text, Skeleton, Stack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import type React from 'react';
import { GiBurningBlobs } from 'react-icons/gi';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { useReadContract } from 'wagmi';

import ERC20ContractAbi from '~/lib/data/ERC20-ABI.json';
import useNFTActions from '~/lib/hooks/useNFTActions';
import { useTokenStorage } from '~/lib/hooks/useTokenStorage';
import { useWeb3Auth } from '~/lib/providers/web3-provider';
import { polygonAmoyTestnet } from '~/lib/utils/wagmi-config';

const ERC20_ADDRESS = '0xf02f35bF1C8D2c3a1e7255FD9AddC8F2182e0627';
const ERC20_DECIMALS = 18;

type PortfolioProps = {
  isTwoCompleted?: boolean;
};

export const Portfolio: React.FC<PortfolioProps> = ({ isTwoCompleted }) => {
  const { address } = useWeb3Auth();
  const { mintNFT, mintLoading, burnLoading, burnNFT } = useNFTActions();
  const { addTokenId, removeTokenId, tokenIds } = useTokenStorage(address!);

  // Utility function to format balance
  const formatBalance = (balance: ethers.BigNumberish) => {
    if (!balance) return '0';
    const formatted = ethers.formatUnits(balance, ERC20_DECIMALS);
    return parseFloat(formatted).toFixed(2);
  };

  const {
    data: balance,
    isError,
    isLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20ContractAbi.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  const mintCallback = (tokenId: number) => addTokenId(tokenId);

  const burnCallback = (tokenId: number) => {
    removeTokenId(tokenId);
    refetchBalance();
  };

  const handleBurnToken = () => {
    if (tokenIds.length > 0) {
      const tokenId = tokenIds[tokenIds.length - 1];
      burnNFT(tokenId, burnCallback);
    }
  };

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
        <Skeleton isLoaded={!isLoading} height="40px" width="150px">
          {isError ? (
            <Text color="red.500" textAlign="center" fontSize="sm">
              Error fetching balance
            </Text>
          ) : (
            <Heading color="black" as="h5" size="md" textAlign="center">
              {formatBalance(balance as ethers.BigNumberish)}{' '}
              {polygonAmoyTestnet.nativeCurrency.symbol}
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
            onClick={() => mintNFT(mintCallback)}
            isDisabled={!isTwoCompleted || mintLoading}
            isLoading={mintLoading}
            loadingText="Minting..."
          >
            Mint NFT
          </Button>
          <Button
            colorScheme="red"
            rounded="3xl"
            leftIcon={<GiBurningBlobs />}
            iconSpacing={1}
            variant="outline"
            isLoading={burnLoading}
            isDisabled={burnLoading || Boolean(!tokenIds.length)}
            onClick={handleBurnToken}
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
