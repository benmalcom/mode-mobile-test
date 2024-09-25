import type { GetBalanceReturnType } from '@wagmi/core';

export const formatBalance = ({
  value,
  decimals,
  symbol,
}: GetBalanceReturnType) =>
  `${(Number(value) / 10 ** decimals).toFixed(4)} ${symbol}`;
