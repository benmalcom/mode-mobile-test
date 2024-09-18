import { ethers } from 'ethers';

import { contractAddress } from './erc20Contract';

const getBalance = async (address: string) => {
  const provider = new ethers.Web3Provider(window.ethereum);
  return await provider.getBalance(address, contractAddress);
};

export default getBalance;
