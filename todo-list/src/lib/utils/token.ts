import type { Log, TransactionReceipt } from 'viem';

import { NFT_CONTRACT_ADDRESS } from '~/lib/utils/constants';

export const extractTokenIdFromReceipt = (receipt: TransactionReceipt) => {
  const transferEvent = receipt.logs.find(
    (log: Log) =>
      log.address.toLowerCase() === NFT_CONTRACT_ADDRESS.toLowerCase() &&
      log.topics[0] ===
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  );

  if (transferEvent?.topics[3]) {
    return Number(BigInt(transferEvent.topics[3]));
  }
  return null;
};
