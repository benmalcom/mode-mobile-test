import { Flex, Button, Heading, Text, Skeleton } from '@chakra-ui/react';
import { ethers } from 'ethers';
import type React from 'react';
import { useEffect } from 'react';
import { GiBurningBlobs } from 'react-icons/gi';
import { MdOutlineCreateNewFolder } from 'react-icons/md';
import { useReadContract } from 'wagmi';

import ERC20ContractAbi from '~/lib/data/ERC20-ABI.json';
import ERC721ContractAbi from '~/lib/data/ERC721-ABI.json';
import { useWeb3Auth } from '~/lib/providers/web3-provider';
import { polygonAmoyTestnet } from '~/lib/utils/wagmi-config';

const ERC20_ADDRESS = '0xf02f35bF1C8D2c3a1e7255FD9AddC8F2182e0627';
const NFT_ADDRESS = '0x8E1096fd5C8Ca1EFdC1BC2F64Ae439E0888b1A46';

type PortfolioProps = {
  enabled?: boolean;
};

export const Portfolio: React.FC<PortfolioProps> = () => {
  const { address } = useWeb3Auth();

  // Fetch balance function
  async function fetchBalance(userAddress: string) {
    // Provider (using a public Ethereum node, e.g., Infura, Alchemy)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Contract instance
    const contract = new ethers.Contract(
      ERC20_ADDRESS,
      ERC20ContractAbi.abi,
      signer
    );

    try {
      // Fetch the token balance for the userAddress
      const balance = await contract.balanceOf(userAddress);

      // Fetch the token decimals
      const decimals = await contract.decimals();

      // Adjust the balance to account for decimals
      const adjustedBalance = ethers.formatUnits(balance, decimals);

      console.log(`Balance: ${adjustedBalance} tokens`);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }

  const {
    data: balance,
    isError,
    isLoading,
  } = useReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20ContractAbi.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  console.log('balance ', balance);

  useEffect(() => {
    fetchBalance(address!);
  }, [address]);

  // NFT contract address

  async function mintNFT() {
    try {
      // Connect to the user's MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create a contract instance
      const nftContract = new ethers.Contract(
        NFT_ADDRESS,
        ERC721ContractAbi.abi,
        signer
      );

      // Call the mint function
      const tx = await nftContract.mint();

      console.log('Minting... please wait.');
      await tx.wait();
      console.log('NFT minted successfully!');

      // console.log(`New balance: ${balance1.toString()} NFTs`);
    } catch (err) {
      console.error('Error minting NFT:', err);
    }
  }

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
            <Heading color="black" as="h4" size="lg" textAlign="center">
              {balance?.toString()} {polygonAmoyTestnet.nativeCurrency.symbol}
            </Heading>
          )}
        </Skeleton>
      </Flex>

      <Flex w="full" justify="space-between">
        <Button
          variant="custom"
          rounded="3xl"
          leftIcon={<MdOutlineCreateNewFolder />}
          iconSpacing={1}
          onClick={() => mintNFT()}
        >
          Mint NFT
        </Button>
        <Button
          colorScheme="red"
          rounded="3xl"
          leftIcon={<GiBurningBlobs />}
          iconSpacing={1}
          variant="outline"
        >
          Burn NFT
        </Button>
      </Flex>
    </Flex>
  );
};

export default Portfolio;
