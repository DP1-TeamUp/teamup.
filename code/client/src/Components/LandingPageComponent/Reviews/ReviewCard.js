import React from 'react';
import './ReviewCard.css';
import image from '../svgs/banner3.png';
import { Avatar } from '@material-ui/core';
const ReviewCard = (props) => {
  return (
    <div className='reviewCard'>
      <div className='reviewCard__container'>
        <div className='reviewCard__top'>
          <Avatar style={{ height: '15vh', width: '15vh' }} src={props.pic} />
        </div>
        <div className='reviewCard__bottom'>
          <div className='reviewCard__name'>{props.name}</div>
          <div className='reviewCard__review'>{props.message}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;