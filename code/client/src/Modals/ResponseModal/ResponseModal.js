import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../Components/Button/Button';

import './ResponseModal.css';

const ResponseModal = (props) => {
  const [pop, setPop] = useState('pop__up');
  return ReactDOM.createPortal(
    <div className='responseModal'>
      <div className={`responseModal__container ${pop}`}>
        <div className='responseModal__message'>{props.message}</div>
        <Button
          onClick={() => {
            setPop('pop__down');
            setTimeout(() => {
              props.setOpen();
            }, 500);
          }}
          size='small'>
          Okay
        </Button>
      </div>
    </div>,
    document.getElementById('responsePortal')
  );
};

export default ResponseModal;
