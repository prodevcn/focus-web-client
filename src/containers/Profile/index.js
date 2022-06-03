import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import Blockies from "react-blockies";

import ProfileCollectibles from "./ProfileCollectibles";
import "./style.scss";

const Profile = (props) => {
  const history = useHistory();
  const authState = useSelector((state) => state.auth);
  const { user } = authState;
  const { account } = useWallet();

  useEffect(() => {
    if (!account) {
      history.push("/");
    }
  }, [account]);

  return (
    <div className="profile-page">
      <div className="grey-background">
        {user.coverImage && <img src={user.coverImage} alt="" />}
      </div>
      <div className="container">
        <div className="profile-info">
          <div className="profile-intro">
            {
              user.avatar ? <img src={user.avatar} className="user-picture" alt="" /> :
                <Blockies
                  seed={account ? account : ""}
                  size={24}
                  scale={6}
                  className="user-picture"
                />
            }

            <div className="profile-content">
              <h3 className="user-name">{user.name ?? user.name ?? ""}</h3>
              <span className="user-description">{user.address ?? ""}</span>
              <FontAwesomeIcon
                icon={faCopy}
                style={{ cursor: "pointer" }}
                onClick={() => navigator.clipboard.writeText(user.address ?? "")}
              />
            </div>
          </div>
          <div className="edit-profile-wrapper">
          <Link to="/profile/edit" className="edit-profile">
            Edit Profile
          </Link>
        </div>
        </div>
        
        <ProfileCollectibles />
      </div>
    </div>
  );
};

export default Profile;
