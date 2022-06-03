import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { openCollectibleBuyDialog } from "../../../store/actions/dialogActions";
import { useAuctionContract } from "hooks/useContract";
import config from "../../../contract/config";
import "./style.scss";
import BidDialog from "../../../components/Dialogs/BidDialog";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import Web3 from "web3";
import Blockies from "react-blockies";
import { CardHeader } from "@material-ui/core";
import bigInt from "big-integer";

function intToString(int) {
  if(!int) {
    return ""
  }
  return bigInt(Number(int.toFixed(5))).toString()
}

const CollectibleAuctionCard = (props) => {
  const {
    ownerImg,
    ownerName,
    saleStatus,
    id,
    owner,
    ifpsURL,
    changeLoading,
    contractAddress,
    setBidResultDialog,
    setBidResultStatus,

    quantity,
    highestBid,
    initialPrice,
    startTime,
    endTime,
    minBidDifference,
  } = props;
  const [bidDialogShow, setBidDialogShow] = useState(false);
  const { account } = useWallet();

  const auctionContract = useAuctionContract(
    config.abi.AuctionAbi,
    config.contract.Auction[process.env.REACT_APP_NETWORK_ID]
  );

  const [currentHighestBid, setCurrentHighestBid] = useState()

  const [userBidsSoFar, setUserBidsSoFar] = useState();
  const [auctionFromBlockchain, setAuctionFromBlockchain] = useState();

  const updateUserBidsSoFar = async () => {
    if(!account) {
      return
    }
    const response = await auctionContract.methods
      .getCurrentBid(
        config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
        id,
        account
      )
      .call();

    setUserBidsSoFar(Number(response))
  }

  const updateAuctionFromBlockchain = async () => {
    if(!account) {
      return
    }
    const response = await auctionContract.methods
      .auctionsByToken(
        config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
        id
      )
      .call();

    setAuctionFromBlockchain(response)
  }

  useEffect(() => {
    updateUserBidsSoFar()
    updateAuctionFromBlockchain()
  }, [account])

  
  const auctionEnded = (new Date(endTime * 1000)).getTime() < (new Date()).getTime()
  const minBid = highestBid || initialPrice + minBidDifference
  const minAdditionalBid = minBid - userBidsSoFar || 0
  
  const [bid, setBid] = useState(minAdditionalBid ? Web3.utils.fromWei(intToString(minAdditionalBid)) : 0);
  
  const toBeCharged = minAdditionalBid && parseFloat(bid) ? bigInt(Web3.utils.toWei(bid)).subtract(bigInt(userBidsSoFar || 0)).toString() : "0"

  function isBidValid() {
    return minAdditionalBid && parseFloat(bid) && Number(Web3.utils.toWei(bid)) >= minBid
  }

  const isHighestBidder = account && auctionFromBlockchain ? auctionFromBlockchain.highestBidder === account : false
  const isOwner = String(owner).toLowerCase() === String(account).toLowerCase()
  const canBid = account && auctionFromBlockchain && !isHighestBidder && !isOwner
  const canConfirmBid = canBid && isBidValid()

  const onBid = async () => {
    if(!toBeCharged) {
      return
    }
    setBidDialogShow(false);
    changeLoading(true);
    let bidStatus = true;
    try {
      console.log(config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID], id)
      const response = await auctionContract.methods
        .placeBid(
          config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
          id
        )
        .send({
          value: toBeCharged,
          from: account,
        });
    } catch (error) {
      console.log("Error: ", error);
      changeLoading(false);
      bidStatus = false;
      setBidResultDialog(true);
      setBidResultStatus(false);
    }
    if (bidStatus) {
      setBidResultStatus(true);
      setBidResultDialog(true);
    }
    updateUserBidsSoFar()
    updateAuctionFromBlockchain()
    setCurrentHighestBid(toBeCharged)
    changeLoading(false);
  };

  return (
    <div>
      <div className="collectible-buy-card">
        <div className="buy-card-header">
          <h3 className="card-title">
            {quantity == 1 ? "Unique " : ""}Photo Asset
          </h3>
          <div className="rating-infos">
            <img className="rating-img" src="/img/type1.png" alt="" />
            <span className="rating-text">{Web3.utils.fromWei(String(currentHighestBid || highestBid || initialPrice || 0))}</span>
          </div>
        </div>

        {auctionEnded ? (
          <>
            <span className="form-label">Auction ended at: {(new Date(endTime * 1000)).toLocaleString()}</span>
            <br/>
          </>
        ) : (
          <>
          <span className="form-label">Auction ends at: {(new Date(endTime * 1000)).toLocaleString()}</span>
            {canBid ? (
              <div className="form-input-wrapper">
                <div className="collectible-form-control">
                  <span className="form-label">Bid (BNB) (Includes your previous bids)</span>
                  <div className="form-input-wrapper">
                    <input
                      pattern="^\d*(\.\d{0,2})?$"
                      className="form-input"
                      value={bid}
                      onChange={(e) => {
                        const val = e.target.value
                        if (/^[0-9]{0,}\.?[0-9]{0,}$/.test(val)) {
                          setBid(val)
                        }
                      }}
                    />
                    <span className="form-input-description">bid</span>
                  </div>
                  {userBidsSoFar !== undefined ? <span className="form-label">Your previous bids: {Web3.utils.fromWei(intToString(userBidsSoFar))}</span> : null}
                  {isBidValid() && toBeCharged ? <span className="form-label">To be charged now: {Web3.utils.fromWei(toBeCharged)}</span> : null}
                </div>
              </div>
            ) : null}
            <button disabled={!canConfirmBid} style={{ opacity: canConfirmBid ? "1" : "0.5" }} className="buy-btn" onClick={() => {
              if(canConfirmBid) {
                setBidDialogShow(true)
              }
            }}>
              {!account ? "Connect your wallet to bid" : isHighestBidder ? "You are the highest bidder" : isOwner ? "You are the owner" : isBidValid() ? "Place Bid" : minAdditionalBid ? `Min. bid is ${Web3.utils.fromWei(intToString(minBid))}` : "Loading"}
            </button>
          </>
        )}

        <div className="owner-info">
          {ownerImg && owner ? (
            <img className="owner-img" src={ownerImg} alt="" />
          ) : (
            <Blockies
              seed={owner ? owner : ""}
              size={12}
              scale={3}
              className="owner-img"
            />
          )}
          <div>
            <div className="owner-info-detail">
              <h3 className="owner-name">{ownerName}</h3>
              <span className="owner-type">Owner</span>
            </div>
          </div>
        </div>

        <div className="quantity-info">
          <span>
            {quantity} of {quantity} edition
          </span>
        </div>
        <hr className="card-divider" />
        <div className="card-actions">
          <div
            className="card-actions__item"
            onClick={() => window.open(ifpsURL)}
          >
            <img
              className="card-actions__item__imgipfs"
              src="/img/IPFS.png"
              alt=""
            />
            <span className="card-actions__item__text">
              View on Interplanetary File System(IPFS)
            </span>
          </div>

          <div
            className="card-actions__item"
            onClick={() =>
              window.open(`https://bscscan.com/address/${contractAddress}`)
            }
          >
            <img
              className="card-actions__item__img"
              src="/img/BscScan.png"
              alt=""
            />
            <span className="card-actions__item__text">View on BscScan</span>
          </div>
        </div>
      </div>

      <BidDialog
        show={bidDialogShow}
        closeDlg={() => setBidDialogShow(false)}
        onPlaceBid={onBid}
        valueInBnb={Web3.utils.fromWei(toBeCharged || "0")}
      />
    </div>
  );
};

const mapDispatchToProps = {
  openCollectibleBuyDialog,
};

export default connect(null, mapDispatchToProps)(CollectibleAuctionCard);
