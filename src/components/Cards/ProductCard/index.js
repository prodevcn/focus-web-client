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
import BuyDialog from '../../Dialogs/BuyDialog';
import config from '../../../contract/config';
import { setCollectibleData } from '../../../store/actions/collectibleAction';
import { openCollectibleBuyDialog } from '../../../store/actions/dialogActions';

const ProductCard = (props) => {
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
    config.contract.Marketplace[process.env.REACT_APP_API],
  );
  const nftContract = useNFT1155Contract(
    config.abi.NFT1155Abi,
    config.contract.NFT1155[process.env.REACT_APP_API],
  );
  const disabled = type === 'collectible' || type === 'created';

  useEffect(() => {
    // const getPlatformFee = () => {
    // let fee = marketContract.methods.platformFee().call();

    // console.log('FEEE', marketContract.methods.platformFee().call())
    // if (fee.PromiseState == "fulfilled") {
    //   fee = fee.PromiseResult;
    // } else {
    //   fee = 50;
    // }
    // setPlatformFee(fee);
    // };

    // console.log(marketContract)
    // console.log(config.contract.Marketplace[process.env.REACT_APP_API])
    // getPlatformFee();
  }, []);

  // getPlatformFee().then(res => platformFee = res);

  const onBuyItem = async () => {
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

  async function viewCollective() {
    if (creator && id) historyRoute.push(`/collectible/${creator}/${id}`);
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
          viewCollective();
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
            {!disabled && (
              <div className="rating-container">
                {startingBid && (
                  <>
                    <img src="/img/bid.png" className="bid-img" alt="" />
                    <span className="bid-text">Starting Bid</span>
                  </>
                )}
                <img src="/img/type1.png" className="rating-img" alt="" />
                <span className="rating-text">
                  {Number(Number(rating)).toFixed(5)}
                </span>
              </div>
            )}
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
            </div>
            <br />
            <div style={{ display: 'block' }}>
              {' '}
              Likes:
              {liked}
            </div>
            <div style={{ display: 'block' }}>
              {' '}
              Views:
              {viewed}
            </div>
          </div>
        </div>
      </div>
      {/* ) : (
        <div className="product-card" key={2}>
          <div className="action-view">
            {action && (
              <span
                className="card-action"
                onClick={() => setActionMode(!actionMode)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            )}
            <div className="action-header">
              <h3 className="action-header__title">{title}</h3>
              <hr className="divider-line" />
              <div className="action-header__content">
                {traderImg ? (
                  <img src={traderImg} className="action-img" alt="" />
                ) : (
                  <Blockies
                    seed={creator ? creator : ""}
                    size={12}
                    scale={3}
                    className="action-img"
                  />
                )}
                <div className="user-detail">
                  {creator ? (
                    <h3 className="user-code">
                      {creator.substr(0, 6) +
                        "...." +
                        creator.substr(creator.length - 4, creator.length - 1)}
                    </h3>
                  ) : (
                    <></>
                  )}
                  <span className="user-type">Creator</span>
                </div>
              </div>
            </div>
            <div className="action-body">
              <div
                className="action-body__item"
                onClick={() => viewCollective()}
              >
                View Photo Asset
              </div>
              {disabled ? (
                <></>
              ) : (
                <div
                  className="action-body__item"
                  // onClick={openCollectibleBuyDialog}
                  onClick={() => setBuyDialogShow(true)}
                >
                  {`Buy for ${Number(Number(rating)).toFixed(5)}`}
                </div>
              )}

              {account ? (
                <div>
                  {type === "collectible" &&
                    creator.toLowerCase() == account.toLowerCase() && (
                      <div className="action-body__item">
                        <div onClick={() => setOnSale()}>Set On Sale</div>
                        <input
                          type="text"
                          className="sale-input"
                          value={inputSalePrice}
                          onChange={(e) => setInputSalePrice(e.target.value)}
                        />
                      </div>
                    )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )} */}
      <BuyDialog
        show={buyDialogShow}
        sale_price={sale_price}
        platformFee={platformFee}
        closeBuyDlg={() => setBuyDialogShow(false)}
        onBuyItem={() => onBuyItem()}
      />
      <SaleWarningDialog
        show={saleWarningDialog}
        closeBuyDlg={() => setSaleWarningDialog(false)}
      />
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
)(withRouter(ProductCard));
// export default ProductCard;
