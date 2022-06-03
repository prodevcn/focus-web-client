import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { useWallet } from '@binance-chain/bsc-use-wallet';
import { faEllipsisH, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Axios from 'axios';

import './styles.scss';
import { useMarketplaceContract, useNFT1155Contract } from 'hooks/useContract';
import Web3 from 'web3';
import Blockies from 'react-blockies';
import { uploadMetadata, uploadFile } from 'utils/ipfs';
import { listSaleItem, mintNFT } from 'contract/minter';
import SaleWarningDialog from 'components/Dialogs/SaleWarningDialog';
import CollectionList from 'containers/Home/CollectionList';
import BuyDialog from '../../Dialogs/BuyDialog';
import config from '../../../contract/config';
import { setCollectibleData } from '../../../store/actions/collectibleAction';
import { openCollectibleBuyDialog } from '../../../store/actions/dialogActions';

const CollectionCard = (props) => {
  const historyRoute = useHistory();
  const {
    id,
    type,
    title,
    img,
    creator,
    description,
    descriptionImg,
    rating,
    traderImg,
    startingBid,
    action = true,
    quantity,
    openCollectibleBuyDialog,
    setCollectibleData,
    changeLoading,
    setBuyResultDialog,
    setBuyResultStatus,
    liked,
    viewed,
    shared,
  } = props;

  const history = useHistory();
  const sale_price = Number(Number(rating)).toFixed(5);
  const [buyDialogShow, setBuyDialogShow] = useState(false);
  const [platformFee, setPlatformFee] = useState(50);
  const { account } = useWallet();
  const [inputSalePrice, setInputSalePrice] = useState(rating);
  const [saleWarningDialog, setSaleWarningDialog] = useState(false);

  const [actionMode, setActionMode] = useState(false);
  const marketContract = useMarketplaceContract(
    config.abi.MarketplaceAbi,
    config.contract.Marketplace[process.env.REACT_APP_NETWORK_ID],
  );
  const nftContract = useNFT1155Contract(
    config.abi.NFT1155Abi,
    config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
  );
  const disabled = type === 'collectible' || type === 'created';

  useEffect(() => {
    // const getPlatformFee = () => {
    //   let fee = marketContract.methods.platformFee().call();
    //   if (fee.PromiseState == "fulfilled") {
    //     fee = fee.PromiseResult;
    //   } else {
    //     fee = 50;
    //   }
    //   setPlatformFee(fee);
    // };
    // getPlatformFee();
  }, []);

  // getPlatformFee().then(res => platformFee = res);

  const onClick = async () => {
    setBuyDialogShow(false);
    let buyStatus = true;
    changeLoading(true);
    try {
      const response = await marketContract.methods
        .buyItem(
          config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
          id,
          creator,
        )
        .send({
          value: Web3.utils.toWei(
            String(
              Number(
                (Number(rating) * 1 * (10000 + platformFee)) / 10000,
              ).toFixed(5),
            ),
          ),
          from: account,
        });
    } catch (error) {
      console.log('Error uploading file: ', error);
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

  async function viewCollection() {
    console.log(creator);
    console.log(id);
    if (creator) historyRoute.push(`/collection/${creator}/${id}`);
  }

  const allImages = document.querySelectorAll('img');
  allImages.forEach((value) => {
    value.oncontextmenu = (e) => {
      e.preventDefault();
    };
  });

  // Set on sale part

  const setOnSale = async () => {
    const { id, quantity } = props;
    const price = inputSalePrice;
    if (inputSalePrice == 0) {
      setSaleWarningDialog(true);
    }

    // const listResult = await listSaleItem(
    //   marketContract,
    //   nftContract,
    //   account,
    //   id,
    //   quantity,
    //   Web3.utils.toWei(price.toString())
    // );
  };

  return (
    <>
      {/* {!actionMode ? ( */}
      <div
        className="product-card"
        key={1}
        onClick={() => {
          // if (action) setActionMode(!actionMode);
          viewCollection();
        }}
      >
        <div className="main-view">
          {/* {action && !disabled && (
            <span
              className="card-action"
            >
              <FontAwesomeIcon icon={faEllipsisH} />
            </span>
          )} */}
          <div className="image-container">
            <img
              className="product-img"
              src={img || '/img/bid.png'}
              alt=""
              onContextMenu={(ev) => true}
            />
          </div>
          <div className="product-content">
            <h4 className="product-title">{title}</h4>
            <div className="product-description">
              {descriptionImg && (
                <img
                  src={descriptionImg}
                  className="product-description__img"
                  alt=""
                />
              )}
              <span className="product-description__text">{description}</span>
            </div>
          </div>
          <div className="quantity-view">
            <span>
              Edition: &nbsp;
              {quantity}
            </span>
          </div>
          <div className="product-footer">
            <div className="trader-image-wrapper">
              {traderImg ? (
                <img src={traderImg} className="trader-image" alt="" />
              ) : (
                <Blockies
                  seed={creator || ''}
                  size={6}
                  scale={3}
                  className="trader-image"
                />
              )}
              <span>{creator}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  item_rating: state.rating,
  item_quantity: state.quantity,
});
const mapDispatchToProps = {
  openCollectibleBuyDialog,
  setCollectibleData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(CollectionCard));
// export default CollectionCard;
