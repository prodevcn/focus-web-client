import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Blockies from 'react-blockies'

import AccountCollectibles from "./AccountCollectibles";
import "./style.scss";

const Account = (props) => {
  const { address } = useParams();
  const history = useHistory();
  const authState = useSelector((state) => state.auth);
  // const { user } = authState;
  const [user, setUser] = useState();

  const fetchUserData = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_API}/account?address=${address}`
    );
    setUser(data.user);
    console.log({data})
  };

  

  useEffect(() => {
    if (!address) {
      history.push("/");
    }
    fetchUserData();
  }, [address]);

  console.log("=====", user);

  return (
    <div className="profile-page">
      <div className="grey-background">
        {user && user.coverImage && <img src={user.coverImage} alt="" />}
      </div>
      <div className="container">
        <div className="profile-info">

          <div className="profile-intro">
            {
              user && user.avatar ?
                <img
                  src={user.avatar}
                  className="user-picture"
                  alt=""
                /> :

                <Blockies
                  seed={address ? address : ""}
                  size={12}
                  scale={8}
                  className="user-picture"
                />
            }

            <div className="profile-content">
              <h3 className="user-name">{user && user.name ? user.name : ""}</h3>
              <span className="user-description">
                {address}
              </span>
              <FontAwesomeIcon
                icon={faCopy}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigator.clipboard.writeText(address)
                }
              />
            </div>
          </div>

          <div className="profile-social">
            <span className="social-item">Twitter</span>
            <span className="social-item">Instagram</span>
          </div>
        </div>
        {
          user ? <AccountCollectibles traderImg={user.avatar} /> : <AccountCollectibles />
        }
      </div>
    </div>
  );
};

export default Account;
