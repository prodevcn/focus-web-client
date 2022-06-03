import React, { useState } from "react";
import { Dialog } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

const BuyDialog = (props) => {
  const { show, closeBuyDlg, onBuyItem, sale_price, platformFee } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeBuyDlg}
      maxWidth={"xs"}
    >
      <FontAwesomeIcon
        icon={faTimes}
        className="close-icon"
        onClick={closeBuyDlg}
      />

      <div className="dialog-body">
        <h2 className="dialog-title">Confirm Purchase</h2>
        <p className="dialog-description">
          You will be asked to confirm the purchase in your wallet. You are
          about to purchase.
        </p>
        <div className="collectible-prices">
          <div className="collectible-prices__item">
            <span className="collectible-prices__item__text">Sale Price</span>
            <span className="collectible-prices__item__text">
              {sale_price} BNB
            </span>
          </div>

          <div className="collectible-prices__item">
            <span className="collectible-prices__item__text">
              Service Fee({platformFee / 10}%)
            </span>
            <span className="collectible-prices__item__text">
              {(sale_price * platformFee) / 10000} BNB
            </span>
          </div>

          <div className="collectible-prices__item total">
            <span className="collectible-prices__item__text">Total</span>
            <span className="collectible-prices__item__text">
              {(
                Number((sale_price * platformFee) / 10000) + Number(sale_price)
              ).toFixed(5)}{" "}
              BNB
            </span>
          </div>
        </div>

        <button className="confirm-btn" onClick={onBuyItem}>
          I Understand
        </button>
      </div>
    </Dialog>
  );
};

export default BuyDialog;
