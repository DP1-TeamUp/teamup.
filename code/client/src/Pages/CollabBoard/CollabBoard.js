import React from 'react';
import './CollabBoard.css';
import BigDropDown from '../../Components/BigDropDown/BigDropDown';
import ArtBoard from '../../Components/ArtBoard/ArtBoard';

const CollabBoard = () => {
  return (
    <div className='collabboard'>
      <div className='collabboard__navbar'>
        <BigDropDown />
      </div>
      <div className='collabboard__content'>
        <div className='collabboard__left'>
          <ArtBoard />
        </div>
        <div className='collabboard__right'></div>
      </div>
    </div>
  );
};

export default CollabBoard;