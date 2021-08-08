import React, { useState } from 'react';

import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import { useHistory, useParams } from 'react-router-dom';

const RecoveryFirstForm = () => {
  const { email } = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <div className='signin__form'>
      {loading && <Spinkit />}
      {open && (
        <ResponseModal setOpen={() => setOpen(false)} message={message} />
      )}
      <div className='signin__header'>Account Recovery</div>
      <div
        style={{
          marginBottom: '4vh',
          color: '#f2f2f2',
          width: '21.5vw',
          fontSize: '0.9vw',
        }}>
        An email with a verification code was just sent to <b>{email}</b>
      </div>
      <div className='signin__inputdiv'>
        <div className='signin__label'>Verification Code</div>
        <input
          className='signin__input'
          id='code'
          type='code'
          placeholder=''
          value={verificationCode}
          onChange={(e) => {
            setVerificationCode(e.target.value);
          }}
        />
      </div>
      <div className='signin__buttondiv'>
        <button
          className='signin__button'
          onClick={() => {
            history.push(`/account-recovery/stepThree/${verificationCode}`);
          }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default RecoveryFirstForm;
