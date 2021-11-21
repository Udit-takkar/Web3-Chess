import { Web3Storage } from 'web3.storage/dist/bundle.esm.min';

function getAccessToken() {
  return process.env.REACT_APP_WEB3STORAGE_KEY;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

function makeFileObjects(obj) {
  const buffer = Buffer.from(JSON.stringify(obj));
  const files = [new File([buffer], 'game.json')];
  return files;
}

async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  return cid;
}

export { makeFileObjects, storeFiles, getAccessToken };
