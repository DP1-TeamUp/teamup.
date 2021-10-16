import React from 'react';

import './SingleNotice.css';

const SingleNotice = (props) => {
  return (
    <div className='singleNotice'>
      <div className='singleNotice__projectName'>{props.projectName}</div>
      <div className='singleNotice__subject'>{props.subject}</div>
      <div className='singleNotice__content'>{props.notification}</div>
    </div>
  );
};

export default SingleNotice;
