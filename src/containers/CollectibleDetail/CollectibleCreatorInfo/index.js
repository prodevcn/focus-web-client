import React, { useState } from 'react';
import './styles.scss';
import Axios from "axios";
import Blockies from 'react-blockies';


const CollectibleCreatorInfo = (props) => {
  const { title = '', creatorImg = '', creatorName = '', creatorAddress, description = '' } = props;

  return (
    <div className="collectible-creator-info">
      <h1 className="collectible-name">{title.toUpperCase()}</h1>
      <div className="creator-infos">
        {
          creatorImg && creatorAddress ?
            <img className="creator-img" src={creatorImg} alt="" /> :
            <Blockies
              seed={creatorAddress ? creatorAddress : ""}
              size={12}
              scale={3}
              className="creator-img"
            />
        }
        <div>
          <div className="creator-info-detail">
            <h4 className="creator-name">{creatorName}</h4>
            <span className="creator-type">Creator</span>
          </div>
          {/* {creatorAddress ? <span className="creator-type">{creatorAddress.substr(0, 6) +
            "...." +
            creatorAddress.substr(creatorAddress.length - 4, creatorAddress.length - 1)}</span> : <></>} */}
        </div>
      </div>
      <p className="creator-description">{description}</p>
    </div>
  );
};

export default CollectibleCreatorInfo;
