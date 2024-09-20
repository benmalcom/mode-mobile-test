import { useEffect, useState } from 'react';

// localStorage key
const STORAGE_KEY = 'TokenOwnership';

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

export const useTokenStorage = (address: string) => {
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  useEffect(() => {
    // Load token IDs from localStorage on component mount
    const storedData = getStoredData();
    const record = storedData[address];
    if (record) {
      setTokenIds(record.tokenIds);
    }
  }, [address]);

  // Add token ID to the storage
  const addTokenId = (tokenId: number): void => {
    const storedData = getStoredData();
    const record = storedData[address] || { address, tokenIds: [] };

    if (!record.tokenIds.includes(tokenId)) {
      record.tokenIds.push(tokenId);
      storedData[address] = record;
      setStoredData(storedData);
      setTokenIds(record.tokenIds); // Update state
    }
  };

  // Remove token ID from the storage
  const removeTokenId = (tokenId: number): void => {
    const storedData = getStoredData();
    const record = storedData[address];

    if (record) {
      record.tokenIds = record.tokenIds.filter((id) => id !== tokenId);
      storedData[address] = record;
      setStoredData(storedData);
      setTokenIds(record.tokenIds); // Update state
    }
  };

  // Get all token IDs associated with the address
  const getTokenIdsByAddress = (): number[] => {
    const storedData = getStoredData();
    const record = storedData[address];
    return record ? record.tokenIds : [];
  };

  return { tokenIds, addTokenId, removeTokenId, getTokenIdsByAddress };
};
