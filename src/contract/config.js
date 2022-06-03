import NFT1155Abi from "./abi/nft1155.json";
import MarketplaceAbi from "./abi/marketplace.json";
import AuctionAbi from "./abi/auction.json";
require("dotenv").config();

const config = {
  abi: {
    NFT1155Abi,
    MarketplaceAbi,
    AuctionAbi,
  },
  contract: {
    NFT1155: {
      97: "0x55Fdba43775f3914b6c30A1dE112e64531E99F8d",
      42: "0x8677B12cC63bA8F960dB7fB021D7C497be719581",
    },
    Marketplace: {
      97: "0x68CED7e742122066e2B5444e041349637C8A46E9",
      42: "0xf8BC88d2ed8C3945B4f5933F97842F10F9d08c52",
    },  
    Auction: {
      97: "0x329a49696878AaD4af3524E5B89e1cA6a204f36B",
      42: "0x8c89033b8A858Ab6F3BCf509b28D825dE94c30A5"
    }
  },
};

export default config;
