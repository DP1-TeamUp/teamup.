import React from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link } from 'react-router-dom';

const SingleSprintOverview = ({
  completed,
  endTime,
  ongoing,
  pending,
  sprintNo,
  startTime,
  velocity,
  projectId,
  _id,
}) => {
  const start = new Date(startTime).toString().substring(0, 15);
  const end = new Date(endTime).toString().substring(0, 15);

  const totalStories = completed.length + pending.length + ongoing.length;

  return (
    <div className='sprintOverview__sprintOverview'>
      <div className='sprintOverview__sprintHeader'>Sprint {sprintNo}</div>
      <div className='sprintOverview__sprintBody'>
        <div className='sprintOverview__sprintBodyLeft'>
          <div className='sprintOverview__sprintInfoGroup'>
            <div className='sprintOverview__sprintTitle'>Total Stories:</div>
            <div className='sprintOverview__sprintInfo'>{totalStories}</div>
          </div>
          <div className='sprintOverview__sprintInfoGroup'>
            <div className='sprintOverview__sprintTitle'>Velocity:</div>
            <div className='sprintOverview__sprintInfo'>{velocity}</div>
          </div>
        </div>
        <div className='sprintOverview__sprintBodyMiddle'>
          <div className='sprintOverview__sprintInfoGroup'>
            <div className='sprintOverview__sprintTitle'>Start Time:</div>
            <div className='sprintOverview__sprintInfo'>{start}</div>
          </div>
          <div className='sprintOverview__sprintInfoGroup'>
            <div className='sprintOverview__sprintTitle'>End Time:</div>
            <div className='sprintOverview__sprintInfo'>{end}</div>
          </div>
        </div>
        <Link to={`/sprint/${_id}`} className='sprintOverview__sprintBodyRight'>
          <NavigateNextIcon style={{ fontSize: '3vw' }} />
        </Link>
      </div>
    </div>
  );
};

export default SingleSprintOverview;