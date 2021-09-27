import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../../Components/Button/Button';

import './Suggestion.css';

const SuggestUserModal = (props) => {
  const ordinalSuffix = (number) => {
    let j = number % 10;
    let k = number % 100;
    if (j == 1 && k != 11) {
      return `${number}st`;
    }
    if (j == 2 && k != 12) {
      return `${number}nd`;
    }
    if (j == 3 && k != 13) {
      return `${number}rd`;
    }
    return `${number}th`;
  };
  return ReactDOM.createPortal(
    <div className='responseModal'>
      <div className='responseModal__container paddingMinus'>
        {props.suggested.length === 0 && (
          <div className='responseModal__message'>{props.message}</div>
        )}

        <div className='suggest__data yellowtext'>
          <div className='suggest__rank'>Rank</div>
          <div className='suggest__name'>Name</div>
          <div className='suggest__score'>Score</div>
        </div>
        {props.suggested.length !== 0 &&
          props.suggested.map((user, index) => (
            <div className='suggest__data'>
              <div>{ordinalSuffix(index + 1)}</div>
              <div>{user.name}</div>
              <div>{user.score}</div>
            </div>
          ))}
        <div className='suggest__extraSpace'></div>
        <Button onClick={props.setOpen}>Okay</Button>
      </div>
    </div>,
    document.getElementById('suggestionPortal')
  );
};

export default SuggestUserModal;