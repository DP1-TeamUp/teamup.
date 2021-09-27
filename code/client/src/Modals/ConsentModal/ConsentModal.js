import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../../Components/Button/Button';

import './ConsentModal.css';

const ConsentModal = ({ message, answerNo, answerYes }) => {
  return ReactDOM.createPortal(
    <div className='consentModal'>
      <div className='consentModal__container'>
        <div className='consentModal__text'>{message}</div>
        <div className='consentModal__actionButtons'>
          <Button red='red' onClick={answerYes}>
            Yes
          </Button>
          <Button neutral='neutral' onClick={answerNo}>
            No
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById('consent')
  );
};

export default ConsentModal;