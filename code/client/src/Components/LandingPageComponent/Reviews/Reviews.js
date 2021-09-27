import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Reviews.css';
import ReviewCard from './ReviewCard';

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import niloy from '../svgs/Niloy.PNG';
import ibtid from '../svgs/banner3.png';
import nafiz from '../svgs/nafiz.jpg';
import robi from '../svgs/Robi.PNG';

const Reviews = () => {
  const containerRef = useRef();
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const element = containerRef.current;
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: -30,
      },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: '0px 40%',
          end: '0px 20%',
          scrub: true,
          markers: false,
          pin: false,
        },
      }
    );
  }, []);

  var settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className='review'>
      <div className='review__container' ref={containerRef}>
        <Slider {...settings} className='review__slider'>
          <ReviewCard
            pic={niloy}
            name='Aseer Intiser Niloy'
            message='Teamup has been essential part of our business. I would definitely
            recommend Teamup.'
          />
          <ReviewCard
            pic={ibtid}
            name='Ibtid Rahman'
            message='Teamup has been essential part of our business. I would definitely
            recommend Teamup.'
          />
          <ReviewCard
            pic={nafiz}
            name='Nafiz Imtiaz'
            message='Teamup has been essential part of our business. I would definitely
            recommend Teamup.'
          />
          <ReviewCard
            pic={robi}
            name='Adnan Rahman Robe'
            message='Teamup has been essential part of our business. I would definitely
            recommend Teamup.'
          />
        </Slider>
      </div>
    </div>
  );
};

export default Reviews;