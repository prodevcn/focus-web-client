import React, {useState} from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Dialog } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

const BuyResultDialog = (props) => {
  let history = useHistory();
  const { show, closeBuyDlg, buyResultStatus } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeBuyDlg}
      maxWidth={'xs'}
    >
      <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={closeBuyDlg} />

      <div className="dialog-body">
        <h2 className="dialog-title">Buy Item Status</h2>
        {
          buyResultStatus?<p className="dialog-description">You bought item successfully!</p> :
          <p className="dialog-description">Your buying request has failed.</p>
        }
        {
          buyResultStatus?<button className="confirm-btn" onClick={() => {history.push('/profile'); }}>
          Ok
        </button>:<button className="confirm-btn" onClick={closeBuyDlg}>
          Ok
        </button>
        }
        
        
      </div>
    </Dialog>
  );
};


export default BuyResultDialog;
