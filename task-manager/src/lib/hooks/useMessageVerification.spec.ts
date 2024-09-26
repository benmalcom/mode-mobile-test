import { renderHook, act } from '@testing-library/react-hooks';

import { signAndVerifyMessage } from '~/lib/utils/verify-message';

import { useMessageVerification } from './useMessageVerification';

jest.mock('~/lib/utils/verify-message', () => ({
  signAndVerifyMessage: jest.fn(),
}));

describe('useMessageVerification', () => {
  const mockSignMessageAsync = jest.fn();
  const mockDisconnect = jest.fn();
  const mockAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() =>
      useMessageVerification(
        false,
        undefined,
        mockSignMessageAsync,
        mockDisconnect
      )
    );

    expect(result.current.isMessageVerified).toBe(false);
    expect(result.current.isSigningMessage).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it('should set isMessageVerified to true when localStorage has true value', () => {
    localStorage.setItem('messageVerified', 'true');
    const { result } = renderHook(() =>
      useMessageVerification(
        true,
        mockAddress,
        mockSignMessageAsync,
        mockDisconnect
      )
    );

    expect(result.current.isMessageVerified).toBe(true);
  });

  it('should attempt to verify message when connected and not verified', async () => {
    (signAndVerifyMessage as jest.Mock).mockResolvedValue(true);

    const { result, waitForNextUpdate } = renderHook(() =>
      useMessageVerification(
        true,
        mockAddress,
        mockSignMessageAsync,
        mockDisconnect
      )
    );

    await waitForNextUpdate();

    expect(signAndVerifyMessage).toHaveBeenCalledWith(
      mockSignMessageAsync,
      mockAddress,
      expect.any(String)
    );
    expect(result.current.isMessageVerified).toBe(true);
    expect(localStorage.getItem('messageVerified')).toBe('true');
  });

  it('should set error message and disconnect when signing fails', async () => {
    (signAndVerifyMessage as jest.Mock).mockRejectedValue(
      new Error('Signing failed')
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useMessageVerification(
        true,
        mockAddress,
        mockSignMessageAsync,
        mockDisconnect
      )
    );

    await waitForNextUpdate();

    expect(result.current.errorMessage).toBe('Signing failed');
    expect(mockDisconnect).toHaveBeenCalled();
    expect(localStorage.getItem('messageVerified')).toBe('false');
  });

  it('should set isMessageVerified to false when disconnected', async () => {
    (signAndVerifyMessage as jest.Mock).mockResolvedValue(true);

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ isConnected }) =>
        useMessageVerification(
          isConnected,
          mockAddress,
          mockSignMessageAsync,
          mockDisconnect
        ),
      { initialProps: { isConnected: true } }
    );

    await waitForNextUpdate();

    expect(result.current.isMessageVerified).toBe(true);
    expect(localStorage.getItem('messageVerified')).toBe('true');

    act(() => {
      rerender({ isConnected: false });
    });

    expect(result.current.isMessageVerified).toBe(false);
    expect(localStorage.getItem('messageVerified')).toBe('false');
  });

  it('should not attempt to sign message when not connected', () => {
    const { result } = renderHook(() =>
      useMessageVerification(
        false,
        undefined,
        mockSignMessageAsync,
        mockDisconnect
      )
    );

    expect(result.current.isMessageVerified).toBe(false);
    expect(signAndVerifyMessage).not.toHaveBeenCalled();
  });

  it('should update errorMessage when setErrorMessage is called', () => {
    const { result } = renderHook(() =>
      useMessageVerification(
        true,
        mockAddress,
        mockSignMessageAsync,
        mockDisconnect
      )
    );

    act(() => {
      result.current.setErrorMessage('New error message');
    });

    expect(result.current.errorMessage).toBe('New error message');
  });

  it('should attempt to verify message when connected becomes true', async () => {
    (signAndVerifyMessage as jest.Mock).mockResolvedValue(true);

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ isConnected }) =>
        useMessageVerification(
          isConnected,
          mockAddress,
          mockSignMessageAsync,
          mockDisconnect
        ),
      { initialProps: { isConnected: false } }
    );

    expect(result.current.isMessageVerified).toBe(false);

    rerender({ isConnected: true });

    await waitForNextUpdate();

    expect(signAndVerifyMessage).toHaveBeenCalledWith(
      mockSignMessageAsync,
      mockAddress,
      expect.any(String)
    );
    expect(result.current.isMessageVerified).toBe(true);
    expect(localStorage.getItem('messageVerified')).toBe('true');
  });
});
