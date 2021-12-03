// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor(address marketplaceAddress) ERC721("Web3Chess", "WEB3CHESS") {}

  // struct NFTItem {
  //   uint256 itemId;
  //   string tokenURI;
  //   address owner;
  // }

  // mapping(uint256 => NFTItem) idToItem;

  function createToken(string memory tokenURI) public returns (uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);

    // idToItem[newItemId] = NFTItem(newItemId, tokenURI, msg.sender);
    return newItemId;
  }

  // function fetchMyItems() public view returns (NFTItem[] memory) {
  //   uint256 totalItemCount = _tokenIds.current();
  //   uint256 itemCount = 0;
  //   uint256 currentIndex = 0;

  //   for (uint256 i = 0; i < totalItemCount; i++) {
  //     if (idToItem[i + 1].owner == msg.sender) {
  //       itemCount += 1;
  //     }
  //   }

  //   NFTItem[] memory items = new NFTItem[](itemCount);
  //   for (uint256 i = 0; i < totalItemCount; i++) {
  //     if (idToItem[i + 1].owner == msg.sender) {
  //       uint256 currentId = i + 1;
  //       NFTItem storage currentItem = idToItem[currentId];
  //       items[currentIndex] = currentItem;
  //       currentIndex += 1;
  //     }
  //   }
  //   return items;
  // }
}
