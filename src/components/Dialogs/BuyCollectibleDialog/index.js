import React from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { closeCollectibleBuyDialog } from '../../../store/actions/dialogActions';
import './styles.scss';

const BuyCollectibleDialog = (props) => {
  const { show, closeCollectibleBuyDialog } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeCollectibleBuyDialog}
      maxWidth={'xs'}
    >
      <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={closeCollectibleBuyDialog} />

      <div className="dialog-body">
        <h2 className="dialog-title">Confirm Purchase</h2>
        <p className="dialog-description">You will be asked to confirm the purchase in your wallet. You are about to purchase.</p>
        <div className="collectible-prices">
          <div className="collectible-prices__item">
            <span className="collectible-prices__item__text">Sale Price</span>
            <span className="collectible-prices__item__text">0.3 BNB</span>
          </div>

          <div className="collectible-prices__item">
            <span className="collectible-prices__item__text">Service Fee(2.5%)</span>
            <span className="collectible-prices__item__text">0.0075 BNB</span>
          </div>

          <div className="collectible-prices__item total">
            <span className="collectible-prices__item__text">Total</span>
            <span className="collectible-prices__item__text">0.3075 BNB</span>
          </div>
        </div>

        <button className="confirm-btn">
          I Understand
        </button>
      </div>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  show: state.dialogs.buyCollectibleDialog.show,
  item: state
});

const mapDispatchToProps = {
  closeCollectibleBuyDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyCollectibleDialog);
