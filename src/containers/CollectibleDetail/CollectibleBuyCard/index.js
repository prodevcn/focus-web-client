import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { openCollectibleBuyDialog } from "../../../store/actions/dialogActions";
import { useMarketplaceContract } from "hooks/useContract";
import config from "../../../contract/config";
import "./style.scss";
import BuyDialog from "../../../components/Dialogs/BuyDialog";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import Web3 from "web3";
import Blockies from "react-blockies";
import { CardHeader } from "@material-ui/core";
import Axios from "axios";

let web3 = new Web3(Web3.givenProvider);

const CollectibleBuyCard = (props) => {
  const {
    ownerImg,
    ownerName,
    rating,
    quantity,
    sale_price,
    openCollectibleBuyDialog,
    saleStatus,
    id,
    owner,
    ifpsURL,
    changeLoading,
    contractAddress,
    setBuyResultDialog,
    setBuyResultStatus,
  } = props;


  const [buyDialogShow, setBuyDialogShow] = useState(false);
  const [platformFee, setPlatformFee] = useState(50);
  const { account } = useWallet();

  const marketContract = useMarketplaceContract(
    config.abi.MarketplaceAbi,
    config.contract.Marketplace[process.env.REACT_APP_NETWORK_ID]
  );

  useEffect(() => {
    const getPlatformFee = () => {
      let fee = marketContract.methods.platformFee().call();
      if (fee.PromiseState == "fulfilled") {
        fee = fee.PromiseResult;
      } else {
        fee = 50;
      }
      setPlatformFee(fee);
    };
    getPlatformFee();
  }, []);

  const onBuyItem = async () => {
    setBuyDialogShow(false);
    changeLoading(true);
    let buyStatus = true;
    try {
      let result = await Axios.post(`${process.env.REACT_APP_API}/buy-item`, {
        id
      }).then(async (res) => {
        console.log(res);
        let NFTContract = new web3.eth.Contract(config.abi.NFT1155Abi, config.contract.NFT1155)
        await NFTContract.methods.redeem(account, [res.tokenId, res.pricePerItem, res.imageURL, res.signature], res.amount, res.amount, "");
      }).catch((err) => {
        console.log(err)
      })

      // const response = await marketContract.methods
      //   .buyItem(
      //     config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
      //     id,
      //     owner
      //   )
      //   .send({
      //     value: Web3.utils.toWei(
      //       String(
      //         Number(
      //           (Number(rating) * 1 * (10000 + platformFee)) / 10000
      //         ).toFixed(5)
      //       )
      //     ),
      //     from: account,
      //   });
    } catch (error) {
      console.log("Error uploading file: ", error);
      changeLoading(false);
      buyStatus = false;
      setBuyResultDialog(true);
      setBuyResultStatus(false);
    }
    if (buyStatus) {
      setBuyResultStatus(true);
      setBuyResultDialog(true);
    }
    changeLoading(false);
  };

  return (
    <div>
      <div className="collectible-buy-card">
        <div className="buy-card-header">
          <h3 className="card-title">
            {quantity == 1 ? "Unique" : ""}Photo Asset
          </h3>
          <div className="rating-infos">
            <img className="rating-img" src="/img/type1.png" alt="" />
            <span className="rating-text">{sale_price}</span>
          </div>
        </div>
        {saleStatus && (
          <button className="buy-btn" onClick={() => setBuyDialogShow(true)}>
            Buy now
          </button>
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
            {/* {owner ? (
              <span className="owner-type">
                {owner.substr(0, 6) +
                  "...." +
                  owner.substr(owner.length - 4, owner.length - 1)}
              </span>
            ) : (
              <></>
            )} */}
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

      <BuyDialog
        show={buyDialogShow}
        sale_price={sale_price}
        platformFee={platformFee}
        closeBuyDlg={() => setBuyDialogShow(false)}
        onBuyItem={() => onBuyItem()}
      />
    </div>
  );
};

const mapDispatchToProps = {
  openCollectibleBuyDialog,
};

export default connect(null, mapDispatchToProps)(CollectibleBuyCard);
// export default CollectibleBuyCard;
