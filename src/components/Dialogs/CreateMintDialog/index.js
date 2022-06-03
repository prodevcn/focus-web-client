import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

const CreateMintDialog = (props) => {
  const { show, closeBuyDlg, createMintStatus } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeBuyDlg}
      maxWidth={'xs'}
    >
      <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={closeBuyDlg} />

      <div className="dialog-body">
        <h2 className="dialog-title">Create Item Status</h2>
        {
          createMintStatus?<p className="dialog-description">You created item successfully!</p> :
          <p className="dialog-description">Your creating request has failed.</p>
        }
        
        
        <button className="confirm-btn" onClick={closeBuyDlg}>
          Ok
        </button>
      </div>
    </Dialog>
  );
};


export default CreateMintDialog;
