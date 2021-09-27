import React from 'react';
import './LandingNav.css';

const LandingNav = () => {
  return (
    <div className='landingNav'>
      <div className='landingNav__container'>
        <div className='landingNav__leftSide'>
          <div className='landingNav__logo'>teamup.</div>
          <div className='landingNav__Menu'>
            <div className='landingNav__MenuItem'>Features</div>
            <div className='landingNav__MenuItem'>Reviews</div>
            <div className='landingNav__MenuItem'>Contact Us</div>
          </div>
        </div>
        <div className='landingNav__rightSide'>
          <div className='landingNav__outlineButton'>Login</div>
          <div className='landingNav__line'></div>
          <div className='landingNav__filledButton'>Open App</div>
        </div>
      </div>
    </div>
  );
};

export default LandingNav;