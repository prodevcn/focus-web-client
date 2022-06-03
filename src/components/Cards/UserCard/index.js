import React from 'react';
import './styles.scss';

const UserCard = (props) => {
  const { name, code, logo, contents } = props;

  return (
    <div className="user-card">
      <div className="user-card__header">
        <div className="user-logo">
          <img src={logo} className="logo" alt="logo"/>
        </div>
        <div className="user-info">
          <h6 className="user-name">{name}</h6>
          <span className="user-code">{code}</span>
        </div>
      </div>
      <div className="user-card__body">
        {
          contents?.length > 0
            ?
            contents.map((item, index) => (
              <img key={index} src={item.img} className="content-img" alt={''} />
            ))
            :
            <div className="no-content">
              <span className="no-content__text">This user does not have any content yet</span>
            </div>
        }
      </div>
    </div>
  )
};

export default UserCard;
