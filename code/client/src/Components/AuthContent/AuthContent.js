import React from 'react';
import image from '../../Pages/Signin/signin_image.svg';

import '../../Pages/Signin/Signin.css';

const AuthContent = () => {
  return (
    <>
      <div className='signin__bigTextContainer'>
        <div className='signin__bigText'>Let's make the world productive,</div>
        <div className='signin__bigText'>together.</div>
      </div>
      <div className='signin__imageContainer'>
        <img className='signin__image' src={image} alt='' />
      </div>
    </>
  );
};

export default AuthContent;
