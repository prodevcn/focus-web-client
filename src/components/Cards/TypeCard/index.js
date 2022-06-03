import React from 'react';
import './styles.scss';

const TypeCard = (props) => {
  const { img, title, description } = props;

  return (
    <div className="type-card">
      <div className="card-img-wrapper">
        <img src={img} className="card-img" alt=""/>
      </div>
      <div className="card-content">
        <h4 className="card-title">{ title }</h4>
        <p className="card-description">{ description }</p>
      </div>
    </div>
  );
};

export default TypeCard;
