import Web3 from "web3";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./style.scss";
import Blockies from "react-blockies";

const TopTraders = () => {
  const history = useHistory();
  const [items, setItems] = useState([]);

  const fetchTopTraders = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API}/top-sellers`
    );
    if (data) {
      setItems(data.items);
    }
  };

  useEffect(() => {
    fetchTopTraders();
  }, []);

  return (
    <div className="top-traders">
      <div className="top-traders__header">
        <h2 className="top-traders__header__title">Top Sellers</h2>
        <span className="top-traders__header__description">
          Based on the last 30 days
        </span>
        {/* <a href="#" className="top-traders__header__action">Show all</a> */}
      </div>
      <div className="top-traders__body">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className="trader-item"
              onClick={() => history.push(`/account/${item.address}`)}
            >
              <div className="trader-item__img">
                {item.avatar ? (
                  <img src={item.avatar} className="trader-img" alt="" />
                ) : (
                  <Blockies
                    seed={item.address ? item.address : ""}
                    size={12}
                    scale={3}
                    className="trader-img"
                  />
                )}
              </div>
              <div className="trader-item__content">
                <h6 className="trader-item__content__title">{item.name}</h6>
                <div className="rating-content">
                  <img src="/img/type1.png" className="rating-img" alt="" />
                  <span className="rating">
                    {item.soldAmount
                      ? Web3.utils.fromWei(String(item.soldAmount))
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopTraders;
