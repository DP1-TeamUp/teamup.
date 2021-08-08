import React, { useState } from 'react';

import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import { useHistory, useParams } from 'react-router-dom';
import { resetPassword } from '../../API/user';

const RecoveryFirstForm = () => {
  const { verificationCode } = useParams();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const next = () => {
    setLoading(true);
    const body = {
      resetToken: verificationCode,
      password: password,
      confirmPassword: confirmPassword,
    };
    resetPassword(body).then((response) => {
      setLoading(true);
      if (response.success) {
        setLoading(false);
        history.push('/account-recovery/success');
      } else {
        setMessage(response.message);
        setOpen(true);
        setLoading(false);
      }
    });
  };

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
        Set a new password for your account.
      </div>
      <div className='signin__inputdiv'>
        <div className='signin__label'>New Password</div>
        <input
          className='signin__input'
          id='password'
          type='password'
          placeholder=''
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className='signin__inputdiv'>
        <div className='signin__label'>Confirm Password</div>
        <input
          className='signin__input'
          id='confirm password'
          type='password'
          placeholder=''
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </div>
      <div className='signin__buttondiv'>
        <button className='signin__button' onClick={next}>
          Next
        </button>
      </div>
    </div>
  );
};

export default RecoveryFirstForm;
