import React from 'react';

import AuthContent from '../../Components/AuthContent/AuthContent';
import RecoveryFinalForm from '../../Components/AuthForms/RecoveryFinalForm';

const FirstStep = () => {
  return (
    <div className='signin'>
      <div className='signin__navbar'>teamup.</div>
      <div className='signin__content'>
        <div className='signin__contentLeft'>
          <AuthContent />
        </div>
        <div className='signin__contentRight'>
          <RecoveryFinalForm />
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
