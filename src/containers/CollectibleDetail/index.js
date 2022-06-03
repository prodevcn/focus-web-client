import React, { useEffect, useState } from 'react';
import { connect, Provider } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import './styles.scss';
import { idText } from 'typescript';
import Axios from 'axios';
import { useWallet } from '@binance-chain/bsc-use-wallet';
import Blockies from 'react-blockies';
import Loading from 'components/Common/Loading';
import BuyResultDialog from 'components/Dialogs/BuyResultDialog';
import BidResultDialog from 'components/Dialogs/BidResultDialog';
import twitterImg from 'assets/img/twitter.png';
import InstagramImg from 'assets/img/instagram.png';
import facebookImg from 'assets/img/facebook.png';
import likeImg from 'assets/img/heart.png';
import eyeImg from 'assets/img/eye.png';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

import Web3 from 'web3';
import API from '../../utils/api.js';
import CollectibleHistory from './CollectibleHistory';
import CollectibleCreatorInfo from './CollectibleCreatorInfo';
import CollectibleAuctionCard from './CollectibleAuctionCard';
import CollectibleBuyCard from './CollectibleBuyCard';

const web3 = new Web3(Web3.givenProvider);

const CollectibleDetail = (props) => {
  const { user = {}, collectible_item } = props;
  const [collectible, setCollectible] = useState({});
  const [collectibleItems, setCollectibleItems] = useState('');
  const { id, address } = props.match.params;
  const { account } = useWallet();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saleStatus, setSaleStatus] = useState(true);

  const [buyResultDialog, setBuyResultDialog] = useState(false);
  const [buyResultStatus, setBuyResultStatus] = useState(true);

  const [bidResultDialog, setBidResultDialog] = useState(false);
  const [bidResultStatus, setBidResultStatus] = useState(true);

  const changeLoading = (status) => {
    setLoading(status);
  };

  const fetchCollectible = async () => {
    let user;
    setLoading(true);
    await Axios.get(
      `${process.env.REACT_APP_API}/account?address=${String(
        address,
      ).toLowerCase()}`,
    ).then((res) => {
      user = res.data.user;
    });
    await Axios.get(`${process.env.REACT_APP_API}/collectible?tokenID=${id}`)
      .then((response) => {
        setCollectibleItems({ data: response.data.item });
        Axios.get(`${response.data.item.tokenURI}`)
          .then((res) => {
            Axios.get(
              `${process.env.REACT_APP_API}/sale-item?address=${String(
                address,
              ).toLowerCase()}`,
            )
              .then((resp) => {
                const data = resp.data.items.filter(
                  (t) => t.tokenID === response.data.item.tokenID,
                );
                setUserData(user);
                setLoading(false);
                if (data.length == 0) {
                  setSaleStatus(false);
                }

                Axios.get(
                  `${process.env.REACT_APP_API}/account?address=${String(
                    data[0].owner,
                  ).toLowerCase()}`,
                ).then((resps) => {
                  console.log(data);
                  setCollectible({
                    type: 'saleItem',
                    id,
                    title: response.data.item.name,
                    img: response.data.item.imageURL,
                    ifpsURL: response.data.item.tokenURI,
                    contractAddress: response.data.item.contractAddress,
                    creatorAddress: response.data.item.minter,
                    ownerAddress: data[0].owner,
                    ownerAvatar: data[0].ownerAvatar,
                    minterAvatar: data[0].minterAvatar,
                    description: res.data.description,
                    price: Number(res.data.price).toFixed(5),
                    quantity: res.data.amount,
                    rating: res.data.price,
                    creatorName: res.data.name,
                    ownerName: resps.data.user.name,
                    viewed: data[0].viewed,
                    liked: data[0].liked,
                    shared: data[0].shared,
                  });

                  console.log(collectible);
                })
                  .catch((err) => console.log(err));
              })
              .catch((err) => {
                Axios.get(
                  `${process.env.REACT_APP_API}/auction?address=${String(
                    address,
                  ).toLowerCase()}`,
                )
                  .then((resp) => {
                    const data = resp.data.items.filter(
                      (t) => t.tokenID === response.data.item.tokenID,
                    );
                    setUserData(user);
                    setLoading(false);
                    if (data.length == 0) {
                      setSaleStatus(false);
                    }

                    if (data[0] != undefined) {
                      Axios.get(
                        `${process.env.REACT_APP_API}/account?address=${String(
                          data[0].owner,
                        ).toLowerCase()}`,
                      ).then((resps) => {
                        setCollectible({
                          type: 'auction',
                          id,
                          // title: response.data.item.name,
                          img: response.data.item.imageURL,
                          ifpsURL: response.data.item.tokenURI,
                          contractAddress: response.data.item.contractAddress,
                          creatorAddress: response.data.item.minter,
                          ownerAddress: data[0].owner,
                          ownerAvatar: data[0].ownerAvatar,
                          minterAvatar: data[0].minterAvatar,
                          description: res.data.description,
                          creatorName: res.data.name,
                          ownerName: resps.data.user.name,

                          quantity: data[0].quantity,
                          highestBid: data[0].highestBid,
                          initialPrice: data[0].initialPrice,
                          startTime: data[0].startTime,
                          endTime: data[0].endTime,
                          minBidDifference: data[0].minBidDifference,
                        });
                      })
                        .catch((err) => console.log(err));
                    }
                  });
              });
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  Axios.post(`${process.env.REACT_APP_API}/viewed`, {
    nft_id: Number(collectible.id),
  });

  useEffect(() => {
    fetchCollectible();
  }, [fetchCollectible]);

  const share = async () => {
    console.log(`${process.env.REACT_APP_API}/shared?nft_id=${collectible.id}`);
    await Axios.get(`${process.env.REACT_APP_API}/shared?nft_id=${collectible.id}`).then((res) => {
      console.log('aa');

      console.log(res);
    }).catch((err) => {
      console.log('bb');

      console.log(err);
    });
  };

  console.log(collectible);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="collectible-detail">
          <div className="collectible-infos container">
            <div className="collectible-img-wrapper">
              <div
                onClick={() => window.open(collectible.img)}
              >
                <img
                  className="collectible-img"
                  src={collectible.img}
                  alt=""
                  onContextMenu={(ev) => {
                    ev.preventDefault();
                  }}
                />
              </div>
            </div>

            <div className="social-bar">
              <div>
                <FacebookShareButton
                  url="focus.market"
                  quote="FocusIsTheBest"
                  hashtag="#focus"
                  description="focus"
                  className="Demo__some-network__share-button"
                >
                  <img
                    style={{ width: '40px', height: '40px' }}
                    className="social-icon"
                    src={facebookImg}
                  />
                </FacebookShareButton>
                <TwitterShareButton
                  ti="focus.market"
                  hashtle="New Marketplace - Focus"
                  urltags={['#focus', '#nft']}
                >
                  <img
                    style={{ width: '40px', height: '40px' }}
                    className="social-icon"
                    src={twitterImg}
                  />

                </TwitterShareButton>
                {/* <img className="social-icon" src={InstagramImg} /> */}
              </div>

              <div>
                <img className="social-icon" src={eyeImg} />
                <span style={{ fontSize: '39px' }}>
                  {' '}
                  {collectible.shared}
                  {' '}
                </span>

                <img className="social-icon" src={eyeImg} />
                <span style={{ fontSize: '39px' }}>
                  {' '}
                  {collectible.viewed + 1}
                  {' '}
                </span>

                <a onClick={async () => {
                  console.log('1');
                  const msg = 'We ask you to sign this message to prove ownership of this account.';
                  const prefix = `\x19Ethereum Signed Message:\n${msg.length}`;
                  const msgHash1 = web3.utils.sha3(prefix + msg);

                  const sig = await web3.eth.sign(msgHash1, address);
                  // let hash = await web3.eth.sign(web3.utils.sha3(message), address);
                  console.log(sig);

                  await Axios.post(`${process.env.REACT_APP_API}/like`, {
                    address,
                    nft_id: Number(collectible.id),
                  }, {
                    headers: {
                      signature: sig,
                    },
                  }).then((result) => {
                    console.log('2');
                    console.log(result);
                  }).catch((err) => {
                    console.log('3');
                    console.log(err);
                  });
                }}
                >
                  <img className="social-icon" style={{ cursor: 'pointer' }} src={likeImg} />
                  <span style={{ fontSize: '39px' }}>
                    {' '}
                    {collectible.liked}
                  </span>
                </a>
              </div>
            </div>

            <div className="collectible-info-detail">
              <CollectibleCreatorInfo
                title={collectible.title}
                creatorImg={collectible.minterAvatar}
                creatorName={collectible.creatorName}
                description={collectible.description}
                creatorAddress={collectible.creatorAddress}
              />

              {collectible.type === 'auction' ? (
                <CollectibleAuctionCard
                  description={collectible.description}
                  ownerImg={collectible.ownerAvatar}
                  ownerName={collectible.ownerName}
                  id={id}
                  ifpsURL={collectible.ifpsURL}
                  owner={collectible.ownerAddress}
                  contractAddress={collectible.contractAddress}
                  changeLoading={changeLoading}
                  saleStatus={saleStatus}
                  setBidResultDialog={setBidResultDialog}
                  setBidResultStatus={setBidResultStatus}

                  quantity={collectible.quantity}
                  highestBid={collectible.highestBid}
                  initialPrice={collectible.initialPrice}
                  startTime={collectible.startTime}
                  endTime={collectible.endTime}
                  minBidDifference={collectible.minBidDifference}
                />
              ) : (
                <CollectibleBuyCard
                  description={collectible.description}
                  ownerImg={collectible.ownerAvatar}
                  ownerName={collectible.ownerName}
                  sale_price={collectible.price}
                  rating={collectible.rating}
                  quantity={collectible.quantity}
                  id={id}
                  ifpsURL={collectible.ifpsURL}
                  owner={collectible.ownerAddress}
                  contractAddress={collectible.contractAddress}
                  rating={Number(collectible.rating)}
                  changeLoading={changeLoading}
                  saleStatus={saleStatus}
                  setBuyResultDialog={setBuyResultDialog}
                  setBuyResultStatus={setBuyResultStatus}
                />
              )}
            </div>
          </div>
          <div className="collectible-detail-footer">
            {collectible.ownerAvatar ? (
              <img
                className="user-picture"
                src={collectible.ownerAvatar}
                alt=""
              />
            ) : (
              <Blockies
                seed={collectible.ownerAddress ? collectible.ownerAddress : ''}
                size={12}
                scale={10}
                className="user-picture"
              />
            )}
            <p className="user-name">{collectible.name}</p>
            <Link
              className="profile-link"
              to={`/account/${collectible.ownerAddress}`}
            >
              Visit profile
            </Link>
          </div>
        </div>
      )}
      <BuyResultDialog
        show={buyResultDialog}
        closeBuyDlg={() => setBuyResultDialog(false)}
        buyResultStatus={buyResultStatus}
      />
      <BidResultDialog
        show={bidResultDialog}
        closeBidDlg={() => setBidResultDialog(false)}
        bidResultStatus={bidResultStatus}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  collectible_item: state.collectible,
});

export default connect(mapStateToProps)(withRouter(CollectibleDetail));
