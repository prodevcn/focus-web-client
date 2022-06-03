import React, { useState, useEffect } from 'react';
import '../DropDownSearch/styles.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const DropDownSearch = (props) => {
  const { label, children, selectList } = props;
  const [isOpened, setIsOpened] = useState(false);

  const toggleContainer = React.createRef();

  const onClickOutsideHandler = (event) => {
    if (isOpened) {
      setIsOpened(false);
    } else {
      setIsOpened(true);
    }
  };

  const onSelectList = (item) => {
    selectList(item)
    onClickOutsideHandler()
  }

  useEffect(() => {
    if (isOpened) {
      setIsOpened(false);
    }

    return () => {
      window.removeEventListener('click', onClickOutsideHandler);
    }
  }, []);

  return (
    <div className="custom-dropdown" ref={toggleContainer}>
      <div className="dropdown-label" onClick={(e) => onClickOutsideHandler(e)}>{label}</div>
      {
        isOpened &&
        <div className="dropdown-list">
          {
            children.map((item) =>
            (<div key={item} value={item} className="dropdown-item" onClick={() => onSelectList(item)}>
              {item}
            </div>)
            )
          }
        </div>}
      <div className="icon-container">
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
    </div>
  );
};

export default DropDownSearch;
