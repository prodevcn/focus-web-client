import React from 'react';
import './styles.scss';
import { COLLECTIBLE_HISTORY } from '../../../config/AppDummyData';

const CollectibleHistory = (props) => {
  return (
    <div className="collectible-history">
      <h3 className="collectible-history__title">History</h3>
      <div className="collectible-history-container">
        <table className="history-table">
          <thead>
          <tr className="history-table__header">
            <th>Event</th>
            <th>From</th>
            <th>To</th>
            <th>Transaction</th>
            <th>Date</th>
          </tr>
          </thead>
          <tbody>
          {
            COLLECTIBLE_HISTORY.map((item, index) => (
              <tr key={index} className="history-table__row">
                <td>{ item.event }</td>
                <td>
                  <div className="from-info">
                    <img className="user-img" src={item.fromImg} alt="" />
                    <span>{ item.from }</span>
                  </div>
                </td>
                <td>{ item.to }</td>
                <td>
                  <span className="transaction-info">{ item.transaction }</span>
                </td>
                <td>{ item.date }</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectibleHistory;
