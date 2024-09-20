import { useToast } from '@chakra-ui/react';
import type { Contract, Provider } from 'ethers';
import { ethers } from 'ethers';
import { useState, useEffect, useCallback } from 'react';

import ERC20ContractAbi from '~/lib/data/ERC20-ABI.json';
import ERC721ContractAbi from '~/lib/data/ERC721-ABI.json';

// Constants
const NFT_CONTRACT_ADDRESS = '0x8E1096fd5C8Ca1EFdC1BC2F64Ae439E0888b1A46';
const ERC20_CONTRACT_ADDRESS = '0xf02f35bF1C8D2c3a1e7255FD9AddC8F2182e0627';
const CONFIRMATION_BLOCKS = 5;

// Custom hook for handling mint and burn actions
function useNFTActions() {
  const toast = useToast();
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const [erc20Contract, setErc20Contract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [burnLoading, setBurnLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        const signer = await providerInstance.getSigner();
        setProvider(providerInstance);
        const nftContractInstance = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          ERC721ContractAbi.abi,
          signer // Use signer to make state-changing calls
        );
        const erc20ContractInstance = new ethers.Contract(
          ERC20_CONTRACT_ADDRESS,
          ERC20ContractAbi.abi,
          providerInstance // Use provider for read-only calls
        );

        setNftContract(nftContractInstance);
        setErc20Contract(erc20ContractInstance);
      }
    };

    initializeContract();
  }, []);

  const mintNFT = useCallback(
    async (callback: (tokenId: number) => void) => {
      if (nftContract && provider) {
        setMintLoading(true);
        try {
          const feeData = await provider.getFeeData();
          const { gasPrice } = feeData; // Get estimated gas price in Wei
          const tx = await nftContract.mint({ gasPrice }); // Assumes minting is a state-changing transaction
          const receipt = await tx.wait(CONFIRMATION_BLOCKS);
          const tokenIdHash = receipt.logs[0].topics[3];
          const tokenId = Number(BigInt(tokenIdHash));
          callback(tokenId);
          toast({
            description: `NFT minted successfully. TokenId: ${tokenId}`,
            status: 'success',
          });
        } catch (e) {
          const err = e instanceof Error ? e.message : 'Error minting NFT';
          toast({
            description: err,
            status: 'error',
          });
        } finally {
          setMintLoading(false);
        }
      }
    },
    [nftContract, provider, toast]
  );

  const burnNFT = useCallback(
    async (tokenId: number, callback?: (tokenId: number) => void) => {
      if (nftContract && provider) {
        setBurnLoading(true);
        try {
          const feeData = await provider.getFeeData();
          const { gasPrice } = feeData; // Get estimated gas price in Wei
          const tx = await nftContract.burn(tokenId, { gasPrice });
          await tx.wait(CONFIRMATION_BLOCKS);
          callback?.(tokenId);
          toast({
            description: 'Token burn successful',
            status: 'success',
          });
        } catch (e) {
          const err = e instanceof Error ? e.message : 'Error minting NFT';
          toast({
            description: err,
            status: 'error',
          });
        } finally {
          setBurnLoading(false);
        }
      }
    },
    [nftContract, provider]
  );

  return { mintNFT, burnNFT, mintLoading, burnLoading };
}

export default useNFTActions;
