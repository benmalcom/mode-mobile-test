import { useWriteContract, useSimulateContract } from 'wagmi';

import ERC721ContractAbi from '../../../../smart-contracts/ERC721-ABI.json';

const NFT_ADDRESS = '0x8E1096fd5C8Ca1EFdC1BC2F64Ae439E0888b1A46';

export function useNFTMint() {
  const { data } = useSimulateContract({
    address: NFT_ADDRESS,
    abi: ERC721ContractAbi.abi,
    functionName: 'mint',
  });
  const { writeContract } = useWriteContract();
  return writeContract(data!.request);
}
