import React from 'react';
import TypeCard from '../../../components/Cards/TypeCard';
import './style.scss';

const TypeList = (props) => {
  const { data } = props;

  return (
    <div className="type-list">
      {
        data.map((item,index) => (
          <TypeCard
            img={item.img}
            title={item.title}
            description={item.description}
            key={index}
          />
        ))
      }
    </div>
  )
};

export default TypeList;
