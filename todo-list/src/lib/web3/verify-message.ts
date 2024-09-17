import type { SignMessageParameters, SignMessageReturnType } from '@wagmi/core';

export const signAndVerifyMessage = async (
  signMessageAsync: (
    args: SignMessageParameters
  ) => Promise<SignMessageReturnType>,
  address: string,
  message: string
): Promise<boolean> => {
  try {
    // Sign the message
    const signature = await signMessageAsync({ message });

    // Send the signature, message, and address to the backend for verification
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature, address }),
    });

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();

    // Validate the result structure
    if (result && typeof result.success === 'boolean') {
      return result.success;
    }
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Error signing message:', error);
    return false;
  }
};
