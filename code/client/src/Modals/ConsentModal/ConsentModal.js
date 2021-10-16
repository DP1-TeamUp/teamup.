import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../Components/Button/Button';

import './ConsentModal.css';

const ConsentModal = ({ message, answerNo, answerYes }) => {
  const [pop, setPop] = useState('pop__up');
  return ReactDOM.createPortal(
    <div className='consentModal'>
      <div className={`consentModal__container ${pop}`}>
        <div className='consentModal__text'>{message}</div>
        <div className='consentModal__actionButtons'>
          <Button
            red='red'
            size='small'
            onClick={() => {
              setPop('pop__down');
              setTimeout(() => {
                answerYes();
              }, 500);
            }}>
            Yes
          </Button>
          <Button
            neutral='neutral'
            size='small'
            onClick={() => {
              setPop('pop__down');
              setTimeout(() => {
                answerNo();
              }, 500);
            }}>
            No
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById('consent')
  );
};

export default ConsentModal;
