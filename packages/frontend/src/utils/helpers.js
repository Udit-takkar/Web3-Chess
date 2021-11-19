import { rpcUrls, networkNames } from './constants';

export const logError = error => {
  // eslint-disable-next-line no-console
  console.error(error);
};

export const getRpcUrl = chainId => rpcUrls[chainId] || null;

export const getNetworkName = chainId =>
  networkNames[chainId] || 'Unknown Chain';

export const getAccountString = account =>
  account.slice(0, 5) + '. . . .' + account.slice(-5);
