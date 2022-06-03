import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { useWallet } from "@binance-chain/bsc-use-wallet/";

import { setSearchWord } from "../../store/actions/searchActions";
import { login, logout, setSignature } from "../../store/actions/authActions";
import { PROFILE } from "../../config/AppDummyData";
import DropDown from "../../components/Common/DropDown";
import { shrinkString } from "../../utils/index.js";
import Web3 from "web3";

import "./style.scss";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import Axios from "axios";
import Blockies from 'react-blockies';


const SearchLayout = (props) => {
  const dispatch = useDispatch();
  const {
    account,
    connect,
    reset,
    status,
    error,
    disconnect: walletDisconnect,
  } = useWallet();
  const { searchWord, setSearchWord, history, login, logout } = props;
  const { user } = useSelector((state) => state.auth);
  const web3 = new Web3(Web3.givenProvider);


  useEffect(() => {
    console.log(status)

    if (status === "connected") {
      signMessage(account, process.env.REACT_APP_SIGN_MESSAGE).then(
        async (value, err) => {
          if (!err) {
            const signature = value;
            const { data: pData } = await Axios.get(
              `${process.env.REACT_APP_API}/user`,
              {
                headers: {
                  signature,
                },
              }
            );
            dispatch(login(pData.user));
            dispatch(setSignature(signature));
          } else {
            walletDisconnect();
          }
        }
      );
    }
    return function () {};
  }, [status]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (!!e.target.value) {
        history.push("/search");
      } else {
        history.push("/");
      }
    }
  };

  const signMessage = async (address, message) => {
    return window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });
  };

  const connectWallet = async () => {
    connect();
  };

  const disconnect = () => {
    reset();
    dispatch(setSignature(null));
    logout();
    history.push("/");
  };

  return (
    <div className="app-container">
      <div className="search-bar">
        {/* <div className="logo-wrapper" onClick={() => history.push("/")}>
          <img src="/img/logo.png" className="logo" alt="" />
        </div> */}

        <div className="button-group">
          <button
            className="search-btn btn-normal"
            onClick={() => history.push("/collectible/create")}
          >
            Create
          </button>
          <button
            className="search-btn btn-normal"
            onClick={() => history.push("/")}
          >
            Explorer
          </button>
          <button className="search-btn btn-normal">What's Hot</button>
          <button
            className="search-btn btn-normal"
            onClick={() => window.open("https://focus.market/communityhub")}
          >
            Community Hub
          </button>
        </div>

        <div className="logo-bar">
          <div className="focus-wrapper">
            <img src="/img/focus_market_logo.png" className="logo" alt="" />
          </div>
        </div>

        <div className="search-group">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search for creator or photo assets"
              value={searchWord}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearchWord(e.target.value)}
            />
          </div>

          <div className="bnb-wrapper">
            <img src="/img/eth_logo.png" style={{ width: 40 }} className="logo" alt="" />
          </div>
          {props.signature === null || !account ? (
            <button className="search-btn btn-gigas" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div className="user-info">
              {
                user?.avatar? <img className="user-logo" src={user?.avatar} alt={""} />:
                <Blockies 
                    seed={user.address?user.address:""}
                    size={12}
                    scale={3}
                    className="user-logo"
                  />
              }
              
              <DropDown label={shrinkString(account)} key={Math.random()}>
                <div
                  className="dropdown-item"
                  onClick={() => history.push("/profile")}
                >
                  My Profile
                </div>
                <div className="dropdown-item" onClick={disconnect}>
                  Disconnect
                </div>
              </DropDown>
            </div>
          )}
        </div>
      </div>

      <div className="main-content">{props.children}</div>
    </div>
  );
};

SearchLayout.defaultProps = {
  signature: null,
};

const mapStateToProps = (state) => ({
  searchWord: state.search.searchWord,
  user: state.auth.user,
  signature: state.auth.signature,
});

const mapDispatchToProps = {
  setSearchWord,
  login,
  logout,
  setSignature,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchLayout));
