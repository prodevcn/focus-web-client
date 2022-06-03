import React from 'react';
import ProductCard from '../../../components/Cards/ProductCard';
import './style.scss';

const HotList = (props) => {
  const { data } = props;

  return (
    <div className="hot-list">
      <div className="hot-list__header">
        <img className="hot-list__header__img" src="/img/hot.png" alt="hot" />
        <span className="hot-list__header__title">Hot right now</span>
      </div>
      <div className="hot-list__items">
        {
          data.map((item, index) => (
            <ProductCard
              key={index}
              id={item.id}
              title={item.title}
              img={item.img}
              description={item.description}
              descriptionImg={item.descriptionImg}
              rating={item.rating}
              traderImg={item.traderImg}
              startingBid={item.startingBid}
            />
          ))
        }
      </div>
    </div>
  )
};

export default HotList;
