import React, { useState, useEffect } from "react";
import "./style.scss";
import CollectionCard from "../../../components/Cards/CollectionCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Loading from "components/Common/Loading";
import DropDownSearch from "components/Common/DropDownSearch";
import BuyResultDialog from "components/Dialogs/BuyResultDialog";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const CollectionList = (props) => {
  const { page, loadMoreVisible, list, isItemLoading } = props.data;
  const { type, setType, option, setOption, setTypeOfListing, typeOfListing } = props;
  const [loading, setLoading] = useState(false);
  
  const [ buyResultDialog, setBuyResultDialog ] = useState(false);
  const [ buyResultStatus, setBuyResultStatus ] = useState(true);

  const onLoadMore = props.onLoadMore;
  const [tab, setTab] = useState("explore");

  const filterData = {
    Created: ["Newest First", "Oldest First"],
    // Listed: ["Newest First", "Oldest First"],
    Price: ["Highest First", "Lowest First"],
    // Purchased: ["Most recent", "Least recent"],
  };

  const changeLoading = (status) => {
    setLoading(status)
  }

  const selectSearchType = (item) => {
    setType(item);
    setOption(filterData[item][0]);
  };

  const selectSearchOption = (item) => {
    setOption(item);
  };

  return (
    <div>
      {
        loading ? <Loading /> :
          <div>
            <div className="product-list">
              <div className="product-list__header">
                <div className="product-tabs">
                  <span
                    className={"product-tab " + (tab === "explore" ? "selected" : "")}
                    onClick={() => setTab("explore")}
                  >
                    Collections
                  </span>
                  <span
                    className={"product-tab " + (tab === "ending" ? "selected" : "")}
                    onClick={() => setTab("ending")}
                  ></span>
                </div>
              </div>

              <div className="product-list__items">
                {tab === "explore" &&
                  list.map((item, index) => {
                    let avatar = item.ownerAvatar;
                    if (item.minter == item.owner) {
                      avatar = item.minterAvatar
                    }

                    console.log();

                    const priceToShow = typeOfListing === "saleItem" ? item.pricePerItem / 1e18 : (item.highestBid || item.initialPrice) / 1e18
                    return (
                      <CollectionCard
                        key={index}
                        id={item._id}
                        title={item.name}
                        img={item.imageURL}
                        description={item.description}
                        descriptionImg={item.descriptionImg}
                        rating={priceToShow}
                        quantity={item.quantity}
                        traderImg={avatar}
                        minterImg={item.minterAvatar}
                        startingBid={item.startingBid}
                        creator={item.address}
                        minter={item.minter}
                        constractAddress={item.constractAddress}
                        changeLoading={changeLoading}
                        setBuyResultDialog={setBuyResultDialog}
                        setBuyResultStatus={setBuyResultStatus}
                        liked={item.liked}
                        viewed={item.viewed}
                        shared={item.shared}
                      />
                    )
                  })}
              </div>
            </div>
            <div className="loading">
              {isItemLoading ? (
                <Loading />
              ) : (
                loadMoreVisible && (
                  <button className="search-btn btn-normal" onClick={onLoadMore}>
                    Load More...
                  </button>
                )
              )}
            </div>
          </div>
          
      }
      <BuyResultDialog
        show={buyResultDialog}
        closeBuyDlg={() => setBuyResultDialog(false)}
        buyResultStatus={buyResultStatus}
      />
    </div>

  );
};

export default CollectionList;
