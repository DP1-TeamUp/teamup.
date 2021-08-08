import React from 'react';

import AuthContent from '../../Components/AuthContent/AuthContent';
import RecoveryThirdForm from '../../Components/AuthForms/RecoveryThirdForm';

const ThirdStep = () => {
  return (
    <div className='signin'>
      <div className='signin__navbar'>teamup.</div>
      <div className='signin__content'>
        <div className='signin__contentLeft'>
          <AuthContent />
        </div>
        <div className='signin__contentRight'>
          <RecoveryThirdForm />
        </div>
      </div>
    </div>
  );
};

export default ThirdStep;
