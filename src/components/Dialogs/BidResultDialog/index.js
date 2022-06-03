import React, {useState} from 'react';
import { Dialog } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

const BidResultDialog = (props) => {
  const { show, closeBidDlg, bidResultStatus } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeBidDlg}
      maxWidth={'xs'}
    >
      <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={closeBidDlg} />

      <div className="dialog-body">
        <h2 className="dialog-title">Bid Status</h2>
        {
          bidResultStatus?<p className="dialog-description">You placed the bid successfully!</p> :
          <p className="dialog-description">Your buying request has failed.</p>
        }
        <button className="confirm-btn" onClick={closeBidDlg}>
          Ok
        </button>
      </div>
    </Dialog>
  );
};


export default BidResultDialog;
