import React from 'react';

import facebook from '../svgs/facebook_logo.svg';
import github from '../svgs/github_logo.svg';
import instagram from '../svgs/Instagram_logo.svg';

import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer__left'>
        <div className='footer__logo'>teamup.</div>
        <div className='footer__icons'>
          <img className='footer__icon' src={github} />
          <img className='footer__icon' src={instagram} />
          <img className='footer__icon' src={facebook} />
        </div>
      </div>
      <div className='footer__middle'>
        <div className='footer__group'>
          <div className='footer__title'>About Us</div>
          <div className='footer__link'>Testimonials</div>
          <div className='footer__link'>Careers</div>
          <div className='footer__link'> Investors</div>
        </div>
        <div className='footer__group'>
          <div className='footer__title'>Contact Us</div>
          <div className='footer__link'>Support</div>
          <div className='footer__link'> Destination</div>
          <div className='footer__link'> Sponsorship</div>
        </div>
        <div className='footer__group'>
          <div className='footer__title'>Submit Videos</div>
          <div className='footer__link'> Ambassadors</div>
          <div className='footer__link'>Agency</div>
          <div className='footer__link'> Influencer</div>
        </div>
      </div>
      <div className='footer__right'>
        <div className='footer__label'>Subscribe us for update and news</div>
        <div className='footer__inputContainer'>
          <input className='footer__input' placeholder='Email' />
          <div className='footer__button'>Subscribe</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
