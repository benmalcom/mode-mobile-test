import { useCallback, useEffect, useMemo, useState } from 'react';

import { signAndVerifyMessage } from '~/lib/utils/verify-message';

const MESSAGE_VERIFIED_KEY = 'messageVerified';

export const useMessageVerification = (
  isConnected: boolean,
  address: string | undefined,
  signMessageAsync: any,
  disconnect: () => void
) => {
  const [isMessageVerified, setIsMessageVerified] = useState(
    () =>
      typeof window !== 'undefined' &&
      localStorage.getItem(MESSAGE_VERIFIED_KEY) === 'true'
  );
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const message = useMemo(
    () => `Sign this message to authenticate\n${new Date().toISOString()}`,
    []
  );

  const handleMessageSignAndVerify = useCallback(async () => {
    setIsSigningMessage(true);
    if (!isConnected || !address) {
      setErrorMessage('Wallet not connected or address missing.');
      disconnect();
      return;
    }
    try {
      await signAndVerifyMessage(signMessageAsync, address, message);
      setIsMessageVerified(true);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Unknown error occurred during message signing';
      setErrorMessage(errorMsg);
      disconnect();
    } finally {
      setIsSigningMessage(false);
    }
  }, [isConnected, address, signMessageAsync, message, disconnect]);

  useEffect(() => {
    if (!isConnected) setIsMessageVerified(false);
  }, [isConnected]);

  useEffect(() => {
    localStorage.setItem(MESSAGE_VERIFIED_KEY, String(isMessageVerified));
  }, [isMessageVerified]);

  useEffect(() => {
    if (isConnected && !isMessageVerified) {
      handleMessageSignAndVerify().catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
        disconnect();
      });
    }
  }, [isConnected, isMessageVerified, handleMessageSignAndVerify, disconnect]);

  return { isMessageVerified, isSigningMessage, errorMessage, setErrorMessage };
};
