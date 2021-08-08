import React from 'react';
import './Reports.css';
import BigDropDown from '../../Components/BigDropDown/BigDropDown';

const Reports = () => {
  return (
    <div className='reports'>
      <div className='reports__navbar'>
        <BigDropDown />
      </div>
      <div className='reports__content'></div>
    </div>
  );
};

export default Reports;
