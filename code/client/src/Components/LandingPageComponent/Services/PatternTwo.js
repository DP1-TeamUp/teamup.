import React, { useEffect, useRef } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './PatternOne.css';
const PatternTwo = (props) => {
  const patternTwoRef = useRef();
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const element = patternTwoRef.current;
    gsap.fromTo(
      element,
      {
        opacity: 0,
        x: -1200,
      },
      {
        opacity: 1,
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: '0px 40%',
          end: '0px 10%',
          scrub: true,
          markers: false,
          pin: true,
        },
      }
    );
  }, []);
  return (
    <div className='patternOne'>
      <div className='patternOneContainer' ref={patternTwoRef} id={props.id}>
        <div className='patternOne__right patternTwo__marginRight'>
          <img className='patternOne__image' src={props.patternImage} />
        </div>
        <div className='patternOne__left patternTwo__marginLeft'>
          <div className='patternOne__Title'>{props.title}</div>
          <div className='patternOne__Subtitle'>{props.subtitle}</div>
        </div>
      </div>
    </div>
  );
};

export default PatternTwo;
