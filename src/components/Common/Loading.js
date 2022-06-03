import React from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import "./styles.scss";

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <BeatLoader color="navy"  loading={true}  size={20} margin={2}/>
    </div>
  )
}

export default Loading;