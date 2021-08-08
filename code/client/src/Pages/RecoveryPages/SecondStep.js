import React from 'react';

import AuthContent from '../../Components/AuthContent/AuthContent';
import RecoverySecondForm from '../../Components/AuthForms/RecoverySecondForm';

const SecondStep = () => {
  return (
    <div className='signin'>
      <div className='signin__navbar'>teamup.</div>
      <div className='signin__content'>
        <div className='signin__contentLeft'>
          <AuthContent />
        </div>
        <div className='signin__contentRight'>
          <RecoverySecondForm />
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
