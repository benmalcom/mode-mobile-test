import { usePrevious } from '@chakra-ui/hooks';
import type { GetBalanceReturnType, GetBalanceErrorType } from '@wagmi/core';
import { useCallback, useEffect } from 'react';
import {
  useWriteContract,
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
} from 'wagmi';

import ERC721ContractAbi from '~/lib/data/ERC721-ABI.json';
import { useTokenStorage } from '~/lib/hooks/useTokenStorage';
import {
  CONFIRMATION_BLOCKS,
  ERC20_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
} from '~/lib/utils/constants';
import { extractTokenIdFromReceipt } from '~/lib/utils/token';

// Define the types for the return values
interface UsePortfolioReturn {
  tokenBalance: GetBalanceReturnType | undefined;
  tokenBalanceLoading: boolean;
  tokenBalanceError: GetBalanceErrorType | null;
  mintNft: () => void;
  burnNft: () => void;
  tokenIds: number[];
  isMintPending: boolean;
  isMintConfirming: boolean;
  isBurnPending: boolean;
  isBurnConfirming: boolean;
  mintError: Error | null;
  burnError: Error | null;
}

// Define the types for the callback parameters
interface UsePortfolioParams {
  onMintSuccess?: (tokenId: number) => void;
  onBurnSuccess?: (tokenId: number) => void;
  onMintError?: (error: Error) => void;
  onBurnError?: (error: Error) => void;
}

export const usePortfolio = ({
  onMintSuccess,
  onBurnSuccess,
  onMintError,
  onBurnError,
}: UsePortfolioParams = {}): UsePortfolioReturn => {
  const { address } = useAccount();
  const { addTokenId, removeTokenId, tokenIds, removeLastTokenId } =
    useTokenStorage(address!);

  // Fetch balance
  const {
    data: tokenBalance,
    refetch: refetchTokenBalance,
    error: tokenBalanceError,
    isLoading: tokenBalanceLoading,
  } = useBalance({
    address: address as `0x${string}`,
    token: ERC20_CONTRACT_ADDRESS,
  });

  // Mint NFT
  const {
    data: mintTxHash,
    writeContract: writeMintContract,
    isPending: isMintPending,
    error: mintError,
  } = useWriteContract();

  const mintNft = () =>
    writeMintContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ERC721ContractAbi.abi,
      functionName: 'mint',
    });

  // Burn NFT
  const {
    data: burnTxHash,
    writeContract: writeBurnContract,
    isPending: isBurnPending,
    error: burnError,
  } = useWriteContract();

  const burnNft = () => {
    if (!tokenIds.length) {
      return;
    }
    const tokenId = tokenIds[tokenIds.length - 1];
    writeBurnContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ERC721ContractAbi.abi,
      functionName: 'burn',
      args: [tokenId],
    });
  };

  // Wait for transaction receipts
  const { isLoading: isMintConfirming, data: mintTxReceipt } =
    useWaitForTransactionReceipt({
      hash: mintTxHash,
      confirmations: CONFIRMATION_BLOCKS,
    });

  const { isLoading: isBurnConfirming, data: burnTxReceipt } =
    useWaitForTransactionReceipt({
      hash: burnTxHash,
    });

  // Callbacks
  const mintCallback = useCallback(
    (tokenId: number) => {
      if (!tokenIds.includes(tokenId)) {
        addTokenId(tokenId);
        onMintSuccess?.(tokenId);
      }
    },
    [addTokenId, tokenIds, onMintSuccess]
  );

  const burnCallback = useCallback(
    (tokenId: number) => {
      if (tokenIds.includes(tokenId)) {
        removeTokenId(tokenId);
        refetchTokenBalance();
        onBurnSuccess?.(tokenId);
      }
    },
    [refetchTokenBalance, removeTokenId, tokenIds, onBurnSuccess]
  );

  // Handle mint transaction receipt
  const prevMintTxReceipt = usePrevious(mintTxReceipt);
  useEffect(() => {
    if (mintTxReceipt && mintTxReceipt !== prevMintTxReceipt) {
      const tokenId = extractTokenIdFromReceipt(mintTxReceipt);
      if (tokenId) mintCallback(tokenId);
    }
  }, [mintCallback, mintTxReceipt, prevMintTxReceipt]);

  // Handle Burn transaction receipt
  const prevBurnTxReceipt = usePrevious(burnTxReceipt);
  useEffect(() => {
    if (burnTxReceipt && burnTxReceipt !== prevBurnTxReceipt) {
      const tokenId = extractTokenIdFromReceipt(burnTxReceipt);
      if (tokenId) burnCallback(tokenId);
    }
  }, [burnCallback, burnTxReceipt, prevBurnTxReceipt]);

  // Handle errors
  useEffect(() => {
    if (mintError) {
      onMintError?.(mintError);
    }
  }, [mintError, onMintError]);

  useEffect(() => {
    if (!burnError) return;
    onBurnError?.(burnError);
    if (burnError?.message.includes('ERC721NonexistentToken')) {
      removeLastTokenId();
    }
  }, [burnError, onBurnError, removeLastTokenId]);

  return {
    tokenBalance,
    tokenBalanceLoading,
    tokenBalanceError,
    mintNft,
    burnNft,
    tokenIds,
    isMintPending,
    isMintConfirming,
    isBurnPending,
    isBurnConfirming,
    burnError,
    mintError,
  };
};
