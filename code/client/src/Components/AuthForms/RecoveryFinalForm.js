import React from 'react';

import { useHistory, useParams } from 'react-router-dom';

const RecoveryFirstForm = () => {
  const history = useHistory();

  return (
    <div className='signin__form'>
      <div className='signin__header'>Account Recovery</div>
      <div
        style={{
          marginBottom: '3vh',
          color: '#f2f2f2',
          width: '21.5vw',
          fontSize: '0.9vw',
          textAlign: 'center',
        }}>
        Your Password has been updated successfully
      </div>

      <div className='signin__buttondiv'>
        <button
          className='signin__button'
          onClick={() => {
            history.push('/signin');
          }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default RecoveryFirstForm;
