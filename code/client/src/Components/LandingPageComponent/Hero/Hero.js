import React, { useEffect, useRef } from 'react';
import heroImage from '../svgs/undraw_teamwork_hpdk 1.svg';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

const Hero = () => {
  const bottomRef = useRef();
  const leftRef = useRef();
  const rightRef = useRef();
  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    const element = bottomRef.current;
    gsap.fromTo(
      element,
      {
        opacity: 1,
        y: 0,
      },
      {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: '0px 65%',
          end: '0px 50%',
          scrub: true,
          markers: false,
          pin: false,
        },
      }
    );
  }, []);

  useEffect(() => {
    const element = leftRef.current;
    gsap.fromTo(
      element,
      {
        opacity: 1,
        y: 0,
      },
      {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: '0px -5%',
          end: '0px -10%',
          scrub: true,
          markers: false,
          pin: false,
        },
      }
    );
  }, []);

  useEffect(() => {
    const element = rightRef.current;
    gsap.fromTo(
      element,
      {
        opacity: 1,
        y: 0,
      },
      {
        opacity: 0,
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: '0px -5%',
          end: '0px -10%',
          scrub: true,
          markers: false,
          pin: false,
        },
      }
    );
  }, []);

  return (
    <div className='hero'>
      <div className='hero__top'>
        <div className='hero__left' ref={leftRef}>
          <div className='hero__topTitle'>Manage all of your</div>
          <div className='hero__topTitle'>projects with the</div>
          <div className='hero__topTitle'>most unique project</div>
          <div className='hero__topTitle'>management tool.</div>
          <div className='landingNav__filledButton buttonExtraMargin'>
            Open App
          </div>
        </div>
        <div className='hero__right' ref={rightRef}>
          <img className='hero__image' src={heroImage} />
        </div>
      </div>
      <div className='hero__bottom' ref={bottomRef}>
        <div className='hero__bottomTitle'>Work Together, Grow Together</div>
        <div className='hero__bottomSubTitle'>
          Make plans and do project together without thinking
        </div>
        <div className='hero__bottomSubTitle'>
          about the distance. Teamup is here for you.
        </div>
      </div>
    </div>
  );
};

export default Hero;
