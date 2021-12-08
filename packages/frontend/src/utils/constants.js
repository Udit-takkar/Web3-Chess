import { CONFIG } from '../config';
const { NETWORK_CONFIG } = CONFIG;

export const SUPPORTED_NETWORKS = [80001];

export const rpcUrls = {
  80001: 'https://matic-mumbai.chainstacklabs.com/',
};

export const networkNames = {
  80001: 'Mumbai Testnet',
};

export const pgn2gifURL = 'https://pgn2gif.glitch.me/thing';

export const CREATE_MATCH = 'CREATE_MATCH';
export const JOIN_MATCH = 'JOIN_MATCH';

export const GAME_OUTCOME = {
  PLAYER_ONE: 'playerOne',
  PLAYER_TWO: 'playerTwo',
  DRAW: 'draw',
};
