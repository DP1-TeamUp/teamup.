import React from 'react';
import './Scrollable.css';

const Scrollable = (props) => {
  return <div className='scrollable'>{props.children}</div>;
};

export default Scrollable;
