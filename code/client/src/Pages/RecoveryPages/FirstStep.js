import React from 'react';

import AuthContent from '../../Components/AuthContent/AuthContent';
import RecoveryFirstForm from '../../Components/AuthForms/RecoveryFirstForm';

const FirstStep = () => {
  return (
    <div className='signin'>
      <div className='signin__navbar'>teamup.</div>
      <div className='signin__content'>
        <div className='signin__contentLeft'>
          <AuthContent />
        </div>
        <div className='signin__contentRight'>
          <RecoveryFirstForm />
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
