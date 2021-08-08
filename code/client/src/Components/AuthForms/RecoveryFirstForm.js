import React, { useState } from 'react';

import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import { useHistory } from 'react-router-dom';
import { forgetPassword } from '../../API/user';

const RecoveryFirstForm = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const next = () => {
    setLoading(true);
    const body = {
      email: email,
    };
    forgetPassword(body).then((response) => {
      console.log(response);
      if (response.success) {
        setLoading(false);
        history.push(`/account-recovery/stepTwo/${email}`);
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
        Please enter your Email. We will send you a verification code for the
        process.
      </div>
      <div className='signin__inputdiv'>
        <div className='signin__label'>Email</div>
        <input
          className='signin__input'
          id='email'
          type='text'
          placeholder='.gmail.com'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className='signin__buttondiv'>
        <button onClick={next} className='signin__button'>
          Next
        </button>
      </div>
    </div>
  );
};

export default RecoveryFirstForm;
