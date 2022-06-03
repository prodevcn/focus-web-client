import React, { useState, useEffect } from 'react';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const DropDown = (props) => {
  const { label, children } = props;
  const [isOpened, setIsOpened] = useState(false);

  const toggleContainer = React.createRef();

  const onClickOutsideHandler = (event) => {
    if (isOpened && toggleContainer.current && !toggleContainer.current.contains( event.target )) {
      setIsOpened(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', onClickOutsideHandler);

    return () => {
      window.removeEventListener('click', onClickOutsideHandler);
    }
  }, []);

  return (
    <div className="custom-dropdown" ref={toggleContainer}>
      <div className="dropdown-label" onClick={() => setIsOpened(true)}>{ label }</div>
      {
        isOpened &&
        <div className="dropdown-list">
          { children }
        </div>
      }
      <div className="icon-container">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
    </div>
  );
};

export default DropDown;
