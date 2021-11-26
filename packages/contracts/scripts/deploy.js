/* eslint-disable */
const hre = require("hardhat");

async function main() {
  const Game = await hre.ethers.getContractFactory("GameContract");
  const game = await Game.deploy();
  await game.deployed();

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(game.address);
  await nft.deployed();

  console.log("NFT deployed to", nft.address);
  console.log("Game deployed to", game.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
