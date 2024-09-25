import { useEffect, useState, useCallback, useMemo } from 'react';

// Define the localStorage key
const STORAGE_KEY = 'TokenOwnership';

// Define a TokenOwnershipRecord interface
interface TokenOwnershipRecord {
  address: string;
  tokenIds: number[];
}

// Utility function to get stored data from localStorage
const getStoredData = (): Record<string, TokenOwnershipRecord> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Utility function to save data back to localStorage
const setStoredData = (data: Record<string, TokenOwnershipRecord>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// useTokenStorage hook
export const useTokenStorage = (address: string) => {
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  // Memoize the current token data for the address
  const storedData = useMemo(getStoredData, []);
  const currentRecord = useMemo(
    () => storedData[address] || { address, tokenIds: [] },
    [storedData, address]
  );

  // Load token IDs from localStorage on component mount or address change
  useEffect(() => {
    setTokenIds(currentRecord.tokenIds);
  }, [currentRecord]);

  // Helper function to update the token IDs both locally and in localStorage
  const updateTokenStorage = useCallback(
    (newTokenIds: number[]) => {
      const updatedRecord = { ...currentRecord, tokenIds: newTokenIds };
      const updatedData = { ...storedData, [address]: updatedRecord };

      setTokenIds(newTokenIds);
      setStoredData(updatedData);
    },
    [address, currentRecord, storedData]
  );

  // Add token ID to storage
  const addTokenId = useCallback(
    (tokenId: number) => {
      if (!tokenIds.includes(tokenId)) {
        const newTokenIds = [...tokenIds, tokenId];
        updateTokenStorage(newTokenIds);
      }
    },
    [tokenIds, updateTokenStorage]
  );

  // Remove token ID from storage
  const removeTokenId = useCallback(
    (tokenId: number) => {
      const newTokenIds = tokenIds.filter((id) => id !== tokenId);
      updateTokenStorage(newTokenIds);
    },
    [tokenIds, updateTokenStorage]
  );

  // Remove the last token ID from storage
  const removeLastTokenId = useCallback(() => {
    if (tokenIds.length > 0) {
      const newTokenIds = tokenIds.slice(0, -1); // Remove the last token
      updateTokenStorage(newTokenIds);
    }
  }, [tokenIds, updateTokenStorage]);

  // Get token IDs associated with the address
  const getTokenIdsByAddress = useCallback(
    () => currentRecord.tokenIds,
    [currentRecord]
  );

  return {
    tokenIds,
    addTokenId,
    removeTokenId,
    removeLastTokenId, // Return the new function
    getTokenIdsByAddress,
  };
};
