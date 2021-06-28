import React from 'react';
import ReactDOM from 'react-dom';

import './Spinkit.css';

const Spinkit = () => {
  return ReactDOM.createPortal(
    <div className='spinkit'>
      <div className='sk-chase'>
        <div className='sk-chase-dot'></div>
        <div className='sk-chase-dot'></div>
        <div className='sk-chase-dot'></div>
        <div className='sk-chase-dot'></div>
        <div className='sk-chase-dot'></div>
        <div className='sk-chase-dot'></div>
      </div>
    </div>,
    document.getElementById('spinkit')
  );
};

export default Spinkit;
