import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export async function saveData(data) {
  const added = await client.add(data);
  return added.path;
}
