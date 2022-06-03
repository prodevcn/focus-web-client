import React from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

const SaleWarningDialog = (props) => {
  const { show, closeBuyDlg } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeBuyDlg}
      maxWidth={'xs'}
    >
      <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={closeBuyDlg} />

      <div className="dialog-body">
        <h2 className="dialog-title">Input Sale Price</h2>
        <p className="dialog-description">Enter the sale price amount</p>
        
        <button className="confirm-btn" onClick={closeBuyDlg}>
          Ok
        </button>
      </div>
    </Dialog>
  );
};


export default SaleWarningDialog;
