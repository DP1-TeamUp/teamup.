import React from 'react';

import '../Signin/Signin.css';
import AuthContent from '../../Components/AuthContent/AuthContent';
import SignupForm from '../../Components/AuthForms/SignupForm';

const Signup = () => {
  return (
    <div className='signin'>
      <div className='signin__navbar bottomMargin'>teamup.</div>
      <div className='signin__content'>
        <div className='signin__contentLeft'>
          <AuthContent />
        </div>
        <div className='signin__contentRight'>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
