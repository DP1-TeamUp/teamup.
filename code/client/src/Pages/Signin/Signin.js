import React from 'react';

import './Signin.css';

import SigninForm from '../../Components/AuthForms/SigninForm';
import AuthContent from '../../Components/AuthContent/AuthContent';

const Signin = () => {
  return (
    <div className='signin'>
      <div className='signin__navbar'>teamup.</div>
      <div className='signin__content'>
        <div className='signin__contentLeft'>
          <AuthContent />
        </div>
        <div className='signin__contentRight'>
          <SigninForm />
        </div>
      </div>
    </div>
  );
};

export default Signin;
