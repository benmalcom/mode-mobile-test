import { renderHook, act } from '@testing-library/react-hooks';

import { useTokenStorage } from './useTokenStorage'; // Adjust the import path as necessary

describe('useTokenStorage', () => {
  const testAddress = '0x1234567890abcdef';
  const initialTokenIds = [1, 2, 3];

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with token IDs from localStorage', () => {
    // Set initial data in localStorage
    localStorage.setItem(
      'TokenOwnership',
      JSON.stringify({
        [testAddress]: { address: testAddress, tokenIds: initialTokenIds },
      })
    );

    const { result } = renderHook(() => useTokenStorage(testAddress));

    expect(result.current.tokenIds).toEqual(initialTokenIds); // Ensure initial state matches localStorage
  });

  it('should add a token ID', () => {
    const { result } = renderHook(() => useTokenStorage(testAddress));

    act(() => {
      result.current.addTokenId(4); // Adding a new token ID
    });

    expect(result.current.tokenIds).toContain(4); // Ensure the token ID was added
    expect(localStorage.getItem('TokenOwnership')).toContain('4'); // Ensure it was saved in localStorage
  });

  it('should not add a duplicate token ID', () => {
    localStorage.setItem(
      'TokenOwnership',
      JSON.stringify({
        [testAddress]: { address: testAddress, tokenIds: [1, 2, 3] },
      })
    );

    const { result } = renderHook(() => useTokenStorage(testAddress));

    act(() => {
      result.current.addTokenId(1); // Trying to add a duplicate
    });

    expect(result.current.tokenIds).toEqual([1, 2, 3]); // Should remain unchanged
  });

  it('should remove a token ID', () => {
    localStorage.setItem(
      'TokenOwnership',
      JSON.stringify({
        [testAddress]: { address: testAddress, tokenIds: initialTokenIds },
      })
    );

    const { result } = renderHook(() => useTokenStorage(testAddress));

    act(() => {
      result.current.removeTokenId(2); // Remove token ID 2
    });

    expect(result.current.tokenIds).not.toContain(2); // Ensure token ID 2 was removed
    expect(localStorage.getItem('TokenOwnership')).toContain('2'); // Ensure localStorage was updated
  });

  it('should remove the last token ID', () => {
    localStorage.setItem(
      'TokenOwnership',
      JSON.stringify({
        [testAddress]: { address: testAddress, tokenIds: initialTokenIds },
      })
    );

    const { result } = renderHook(() => useTokenStorage(testAddress));

    act(() => {
      result.current.removeLastTokenId(); // Remove the last token
    });

    expect(result.current.tokenIds).toEqual([1, 2]); // Should only contain the first two tokens
    expect(localStorage.getItem('TokenOwnership')).toContain('3'); // Ensure localStorage reflects the change
  });

  it('should retrieve token IDs by address', () => {
    localStorage.setItem(
      'TokenOwnership',
      JSON.stringify({
        [testAddress]: { address: testAddress, tokenIds: initialTokenIds },
      })
    );

    const { result } = renderHook(() => useTokenStorage(testAddress));

    expect(result.current.getTokenIdsByAddress()).toEqual(initialTokenIds); // Should return the token IDs
  });
});
