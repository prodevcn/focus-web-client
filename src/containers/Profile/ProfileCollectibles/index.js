import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import ProductCard from "components/Cards/ProductCard";
import Loading from "components/Common/Loading";

import "./style.scss";

const ProfileCollectibles = (props) => {
  const { account } = useWallet();
  const [tab, setTab] = useState("sale");
  const [loadingCard, setLoadingCard] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeLoading = (status) => {
    setLoading(status);
  };

  useEffect(() => {
    if (tab === "sale") {
      setItems([]);
      Axios.get(
        `${process.env.REACT_APP_API}/sale-item?address=${String(
          account
        ).toLowerCase()}`
      )
        .then((res) => setItems(res.data.items))
        .catch((err) => console.log(err));
    } else if (tab === "collectible") {
      setItems([]);
      Axios.get(
        `${process.env.REACT_APP_API}/holding?address=${String(
          account
        ).toLowerCase()}`
      )
        .then((res) => setItems(res.data.items))
        .catch((err) => console.log(err));
    } else if (tab === "created") {
      setItems([]);
      Axios.get(
        `${process.env.REACT_APP_API}/created?minter=${String(
          account
        ).toLowerCase()}`
      )
        .then((res) => setItems(res.data.items))
        .catch((err) => console.log(err));
    } else {
      setItems([]);
    }
  }, [tab]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="profile-collectibles">
          <div className="collectible-tabs">
            <span
              className={
                "collectible-tab " + (tab === "sale" ? "selected" : "")
              }
              onClick={() => setTab("sale")}
            >
              On sale
            </span>
            {/* <span
                className={'collectible-tab ' + (tab === 'auction' ? 'selected' : '') }
                onClick={() => setTab('auction')}
              >
                On auction
              </span> */}
            <span
              className={
                "collectible-tab " + (tab === "collectible" ? "selected" : "")
              }
              onClick={() => setTab("collectible")}
            >
              Photo Assets
            </span>
            <span
              className={
                "collectible-tab " + (tab === "created" ? "selected" : "")
              }
              onClick={() => setTab("created")}
            >
              Created
            </span>
          </div>

          <div className="profile-collectibles-content">
            {loadingCard ? (
              "Loading..."
            ) : (
              <div className="product-list__items">
                {items.map((item, index) => {
                  let price = item.pricePerItem
                    ? item.pricePerItem / 1e18
                    : item.price;

                  let creator = item.owner
                    ? item.owner
                    : item.holderAddress
                    ? item.holderAddress
                    : item.minter;
                  let quantity = item.quantity ? item.quantity : item.supply;

                  return (
                    <ProductCard
                      type={tab}
                      key={index}
                      id={item.tokenID}
                      title={item.name}
                      img={item.imageURL}
                      description={item.description}
                      descriptionImg={item.descriptionImg}
                      rating={price}
                      quantity={quantity}
                      traderImg={item.minterAvatar}
                      startingBid={item.startingBid}
                      creator={creator}
                      changeLoading={changeLoading}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCollectibles;
