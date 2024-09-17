import type { ConnectErrorType } from '@wagmi/core/src/actions/connect';

export const formatConnectErrors = (error: ConnectErrorType) => {
  if (!error) return null;

  // Customize error messages based on the error type
  if (error.message.includes('User rejected the request')) {
    return 'You have rejected the connection request.';
  }
  if (error.message.includes('No provider')) {
    return 'MetaMask is not installed. Please install MetaMask to proceed.';
  }
  if (error.message.includes('Request of type')) {
    return 'A connection request is already pending. Please wait or click the MetaMask icon on your browser toolbar.';
  }
  if (error.message.includes('Network Error')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Return the original error message if it doesn't match any of the above conditions
  return error.message;
};
