import React, { useState } from "react";
import { Dialog } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

const BidDialog = (props) => {
  const { show, closeDlg, onPlaceBid, valueInBnb } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeDlg}
      maxWidth={"xs"}
    >
      <FontAwesomeIcon
        icon={faTimes}
        className="close-icon"
        onClick={closeDlg}
      />

      <div className="dialog-body">
        <h2 className="dialog-title">Confirm Bid</h2>
        <p className="dialog-description">
          You will be asked to confirm the transaction in your wallet. You are
          about to bid.
        </p>
        <div className="collectible-prices">
          <div className="collectible-prices__item total">
            <span className="collectible-prices__item__text">Value</span>
            <span className="collectible-prices__item__text">
              {valueInBnb}{" "}
              BNB
            </span>
          </div>
        </div>

        <button className="confirm-btn" onClick={onPlaceBid}>
          I Understand
        </button>
      </div>
    </Dialog>
  );
};

export default BidDialog;
