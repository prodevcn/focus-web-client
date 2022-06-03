import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { useWallet } from '@binance-chain/bsc-use-wallet';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@material-ui/core';
import Web3 from 'web3';
import { useMarketplaceContract, useNFT1155Contract, useAuctionContract } from 'hooks/useContract';
import config from 'contract/config';

import Loading from 'components/Common/Loading';
import CreateMintDialog from 'components/Dialogs/CreateMintDialog';
import ProductCard from '../../components/Cards/ProductCard';
import { uploadMetadata, uploadFile } from '../../utils/ipfs';
import {
  mintNFT, createAuction, lazyMintNFT, listSaleItem,
} from '../../contract/minter';

import './styles.scss';
import Axios from 'axios';

const web3 = new Web3(Web3.givenProvider);

const CreateCollectible = (props) => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('0');
  const priceNumber = parseFloat(price);
  const [initialPrice, setInitialPrice] = useState('0');
  const [auctionDuration, setAuctionDuration] = useState('1day');
  const [tag, setTag] = useState('');
  const [collection, setCollection] = useState('');
  const [royalty, setRoyalty] = useState('0');
  const [amount, setAmount] = useState(1);
  const [mintOption, setMintOption] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const history = useHistory();

  const { account } = useWallet();
  const nftContract = useNFT1155Contract(
    config.abi.NFT1155Abi,
    config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
  );
  const marketContract = useMarketplaceContract(
    config.abi.MarketplaceAbi,
    config.contract.Marketplace[process.env.REACT_APP_NETWORK_ID],
  );

  const auctionContract = useAuctionContract(
    config.abi.AuctionAbi,
    config.contract.Auction[process.env.REACT_APP_NETWORK_ID],
  );

  const [createMintDialog, setCreateMintDialog] = useState(false);
  const [createMintStatus, setCreateMintStatus] = useState(true);

  const validate = () => files.length !== 0 && title !== '' && title !== null;

  const createCollectible = async () => {
    const file = files[0];
    if (account == null) {
      console.log('Please connect the wallet');
      return;
    }
    try {
      if (validate()) {
        const data = {
          file,
        };
        setLoading(true);
        const tokenId = Math.floor(Math.random() * 999999);
        const imageURL = await uploadFile(data);
        const metadata = {
          name: title,
          imageURL,
          description,
          amount,
          royalty: parseFloat(royalty) || 0,
          price: priceNumber || 0,
        };
        console.log({ metadata });
        const tokenURI = await uploadMetadata(metadata);
        console.log('====tokenURI====', tokenURI);

        const msgHash = web3.utils.soliditySha3(
          { type: 'uint256', value: tokenId },
          { type: 'uint256', value: priceNumber },
          { type: 'string', value: imageURL },
        );

        const sig = await web3.eth.sign(msgHash, account);

        const lazyMintResult = await lazyMintNFT(
          account,
          tokenURI,
          imageURL,
          amount,
          tokenId,
          (priceNumber * (10 ** 18)),
          sig,
          account,
          title,
          description,
          collection,
        );

        console.log(lazyMintResult);

        // const mint_result = await mintNFT(
        //   nftContract,
        //   account,
        //   tokenURI,
        //   amount,
        //   amount,
        //   tokenId
        // );
        // console.log(mint_result);
        if (mintOption === 'fixed') {
          const listItemResult = await listSaleItem(
            amount,
            tokenId,
            (priceNumber * (10 ** 18)),
            account,
            collection,
            imageURL,
          );

          console.log(listItemResult);

          // const listResult = await listSaleItem(
          //   marketContract,
          //   nftContract,
          //   account,
          //   tokenId,
          //   amount,
          //   Web3.utils.toWei(price)
          // );
        } else if (mintOption === 'auction') {
          const duration = auctionDuration === '1day' ? 60 * 60 * 24 : auctionDuration === '3day' ? 60 * 60 * 24 * 3 : 60 * 60 * 24 * 7;
          await createAuction(
            auctionContract,
            nftContract,
            account,
            tokenId,
            amount,
            Web3.utils.toWei(initialPrice),
            duration,
            royalty,
          );
        }
        setLoading(false);
        setCreateMintDialog(true);
      }
    } catch (error) {
      console.log('Error uploading file: ', error);
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    await Axios.get(`${process.env.REACT_APP_API}/account?address=${String(account).toLowerCase()}`)
      .then((res) => {
        setUser(res.data.user);
      });
  };

  useEffect(() => {
    if (account) fetchUserData();
    if (mintOption === 'wallet') setPrice(0);
  }, [mintOption, account, fetchUserData]);

  return (
    <div className="create-collectible-page container">
      <h1 className="page-title">Create a new photo asset</h1>
      {
        loading ? <Loading />
          : (
            <div className="page-container">
              <div className="collectible-editor">
                <div className="collectible-img-input">
                  <Dropzone
                    className="drop"
                    onDrop={(dropFiles) => setFiles(dropFiles)}
                  >
                    {files.length > 0 ? (
                      <img
                        className="dropzone-picture"
                        src={files[0].preview}
                        alt=""
                      />
                    ) : (
                      <div className="dropzone-preview">
                        <img className="upload-icon" src="/img/file.png" alt="" />
                        <span className="upload-description">Choose File</span>
                      </div>
                    )}
                    <span className="dropzone-description">
                      JPG, PNG, GIF (Max 50MB)
                    </span>
                    <span className="dropzone-description">
                      MP4, MOV, WEBM, WMV (Max 100MB and limited to 3 minutes)
                    </span>
                  </Dropzone>
                  {files.length === 0 && (
                    <span className="error">File is required</span>
                  )}
                </div>

                <div className="collectible-form-control">
                  <span className="form-label">Title</span>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Give your photo asset a name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="collectible-form-control">
                  <span className="form-label">Tags</span>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add up to 5 tags"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                    />
                  </div>
                  <span className="form-control-description">5 tags left</span>
                </div>

                <div className="collectible-form-control">
                  <span className="form-label">Collection</span>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Write the name of the collection"
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                    />
                  </div>
                </div>

                <div className="collectible-form-control">
                  <span className="form-label">Description</span>
                  <div className="form-input-wrapper">
                    <textarea
                      className="form-input text-area"
                      placeholder="Describe your photo asset"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <FormControl className="collectible-form-control">
                  <FormLabel className="form-label">Ownership</FormLabel>
                  <RadioGroup
                    name="ownership"
                    value={mintOption}
                    onChange={(e) => {
                      setMintOption(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="wallet"
                      control={<Radio color="default" />}
                      label="Mint to my wallet"
                    />
                    <FormControlLabel
                      value="fixed"
                      control={<Radio color="default" />}
                      label="Sell for a fixed price"
                    />
                    <FormControlLabel
                      value="auction"
                      control={<Radio color="default" />}
                      label="Auction"
                    />
                  </RadioGroup>
                </FormControl>

                {mintOption === 'auction' && (
                  <>
                    <FormControl className="collectible-form-control">
                      <FormLabel className="form-label">Auction duration</FormLabel>
                      <RadioGroup
                        name="auction_duration"
                        value={auctionDuration}
                        onChange={(e) => {
                          setAuctionDuration(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="1day"
                          control={<Radio color="default" />}
                          label="1 day"
                        />
                        <FormControlLabel
                          value="3day"
                          control={<Radio color="default" />}
                          label="3 days"
                        />
                        <FormControlLabel
                          value="7day"
                          control={<Radio color="default" />}
                          label="7 days"
                        />
                      </RadioGroup>
                    </FormControl>

                    <div className="collectible-form-control">
                      <span className="form-label">Initial Price (BNB)</span>
                      <div className="form-input-wrapper">
                        <input
                          className="form-input"
                          value={initialPrice}
                          placeholder="0"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^[0-9]{0,}\.?[0-9]{0,}$/.test(val)) {
                              setInitialPrice(val);
                            }
                          }}
                        />
                        <span className="form-input-description">init. price</span>
                      </div>
                    </div>
                  </>
                )}

                {mintOption === 'fixed' && (
                  <div className="collectible-form-control">
                    <span className="form-label">Sale Price (BNB)</span>
                    <div className="form-input-wrapper">
                      <input
                        className="form-input"
                        value={price}
                        placeholder="0"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[0-9]{0,}\.?[0-9]{0,}$/.test(val)) {
                            setPrice(val);
                          }
                        }}
                      />
                      <span className="form-input-description">price</span>
                    </div>
                  </div>
                )}

                <div className="collectible-form-control">
                  <span className="form-label">Number of editions</span>
                  <div className="form-input-wrapper">
                    <input
                      className="form-input"
                      value={amount}
                      placeholder="0"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[0-9]{0,}$/.test(val)) {
                          setAmount(parseInt(val) || '');
                        }
                      }}
                    />
                    <span className="form-input-description">edition</span>
                  </div>
                </div>

                <div className="collectible-form-control">
                  <div className="form-label-container">
                    <span className="form-label">Royalties</span>
                    <Link className="help-link" to="#">
                      Help ?
                    </Link>
                  </div>
                  <div className="form-input-wrapper">
                    <input
                      className="form-input"
                      value={royalty}
                      placeholder="0"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[0-9]{0,}\.?[0-9]{0,}$/.test(val) && ((parseFloat(val) <= 50 && parseFloat(val) >= 0) || val === '')) {
                          setRoyalty(val || '');
                        }
                      }}
                    />
                    <span className="form-input-description">%</span>
                  </div>
                  <span className="form-control-description">
                    Royalties are optional and allow you to earn a percentage on
                    secondary sales
                  </span>
                </div>

                <button
                  className="submit-btn"
                  onClick={createCollectible}
                  disabled={!mintOption || amount == 0 || files.length === 0}
                >
                  Create Photo Asset
                </button>
              </div>

              <div className="collectible-preview">
                <ProductCard
                  title={title || 'Your title here'}
                  img={files.length > 0 ? files[0].preview : ''}
                  description={(amount == 1) ? 'Unique' : ''}
                  rating={price}
                  traderImg={user ? user.avatar : '/img/trader5.png'}
                  action={false}
                  price={price}
                  quantity={amount}
                />
                <p className="preview-description">
                  This is how we'll show your photo asset.
                </p>
              </div>
            </div>
          )
      }
      <CreateMintDialog
        show={createMintDialog}
        closeBuyDlg={() => {
          setCreateMintDialog(false);
          history.push('/');
        }}
        createMintStatus={createMintStatus}
      />
    </div>
  );
};

export default CreateCollectible;
