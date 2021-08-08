import React from 'react';
import './Scrumboard.css';
import BigDropDown from '../../Components/BigDropDown/BigDropDown';
import Kanban from '../../Components/Kanban/Kanban';

const Scrumboard = () => {
  return (
    <div className='scrumboard'>
      <div className='scrumboard__navbar'>
        <BigDropDown />
      </div>
      <div className='scrumboard__content'>
        <Kanban />
      </div>
    </div>
  );
};

export default Scrumboard;
