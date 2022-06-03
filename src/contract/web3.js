import Web3 from "web3";
import config from "./config";

const BN = require("bn.js");

const DEFAULT_PERIOD = 10;

class Store {
  constructor() {
    this.store = {
      account: {},
      web3Context: null,
    }
  }

  setStore(obj) {
    this.store = {...this.store, ...obj};
  }

  getStore(name) {
    return this.store[name];
  }
  //pares Number
  _parseNumber = (amount, decimal) => {
    let decimal_ = 10 ** decimal;
    decimal_ = new BN(decimal_.toString());
    return new BN(new BN(amount).mul(decimal_));
  };

  createOffer = async (url, price) => {
    const web3 = new Web3(store.getStore("web3Context").currentProvider);
    const tradingAuctionContract = new web3.eth.Contract(config.marketAuctionABI, config.marketAuctionAddress);
    try {
      const minter = store.getStore('account');
      const signedTransaction = await tradingAuctionContract.methods.placeBid(
        url
      ).send({ from: minter, value: web3.utils.toWei('' + price) });
      if(signedTransaction.events && signedTransaction.events['BidPlaced']) {
        return { success: true, transactionHash: signedTransaction.transactionHash };
      } else {
        return { success: false }
      }
    } catch(err) {
      return { success: false, error: err };
    }
  }

  grantPermissionResell = async (url) => {
    const web3 = new Web3(store.getStore("web3Context").currentProvider);
    const tradingAuctionContract = new web3.eth.Contract(config.marketAuctionABI, config.marketAuctionAddress);
    const tradingNFTContract = new web3.eth.Contract(config.marketTradingNFTABI, config.marketTradingNFTAddress);

    try {
      const auctionDetail = await tradingAuctionContract.methods.auctionDetails(url).call();

      const tokenId = auctionDetail['tokenId'];
      const minter = store.getStore('account');

      const approvePermission = await tradingNFTContract.methods
        .approve(config.marketAuctionAddress, tokenId)
        .send({ from: minter });
      console.log(approvePermission);
    } catch(err) {
      console.log(err);
    }
  }

  cancelOffer = async (url) => {
    const web3 = new Web3(store.getStore("web3Context").currentProvider);
    const tradingAuctionContract = new web3.eth.Contract(config.marketAuctionABI, config.marketAuctionAddress);
    try {
      const minter = store.getStore('account');
      const signedTransaction = await tradingAuctionContract.methods.withdrawBid(
        url
      ).send({ from: minter });

      if(signedTransaction.events) {
        return { success: true, transactionHash: signedTransaction.transactionHash };
      } else {
        return { success: false }
      }
    } catch(err) {
      return { success: false, error: err };
    }
  }

  placeBid = async (auction, price) => {
    const web3 = new Web3(store.getStore("web3Context").currentProvider);
    const tradingAuctionContract = new web3.eth.Contract(config.marketAuctionABI, config.marketAuctionAddress);
    try {
      const bidder = store.getStore('account');
      const signedTransaction = await tradingAuctionContract.methods.placeBid(
        auction.tokenId
      ).send({ from: bidder, value: web3.utils.toWei('' + price) });
      return { success: true, signedTransaction };
    } catch(error) {
      console.log(error);
      return { success: false, error }
    }                                                                                                                                            
  }

  getAuctionDetail = async (auctionRecord) => {
    let result = {
      ownerName: auctionRecord.user.fullName,
      ownerUsername: auctionRecord.user.instagramUsername,
      ownerAvatar: auctionRecord.user.instagramAvatar,
      price: auctionRecord.price,
      tokenId: auctionRecord.tokenId,
      shortCode: auctionRecord.nft.shortCode,
      imageUrl: auctionRecord.nft.imageUrl,
      title: auctionRecord.nft.title,
      comments: auctionRecord.nft.comments,
      likes: auctionRecord.nft.likes,
      startTime: 1000 * auctionRecord.startTime,
      endTime: 1000 * auctionRecord.endTime,
      id: auctionRecord.id
    };

    return result;
  }
}

const store = new Store();

export default store;