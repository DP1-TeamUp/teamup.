import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../../Components/Button/Button';

import './ResponseModal.css';

const ResponseModal = (props) => {
  return ReactDOM.createPortal(
    <div className='responseModal'>
      <div className='responseModal__container'>
        <div className='responseModal__message'>{props.message}</div>
        <Button onClick={props.setOpen}>Okay</Button>
      </div>
    </div>,
    document.getElementById('responsePortal')
  );
};

export default ResponseModal;
