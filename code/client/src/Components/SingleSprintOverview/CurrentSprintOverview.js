import React from 'react';
import TaskProgress from '../Charts/TaskProgress';
import SingleSprintOverview from './SingleSprintOverview';

const CurrentSprintOverview = ({
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
  const data2 = [
    { name: 'A', value: pending.length, fill: '#2D2D2D' },
    { name: 'B', value: ongoing.length, fill: '#00AAF2' },
    { name: 'C', value: completed.length, fill: '#8F44FD' },
  ];
  const totalTask = pending.length + ongoing.length + completed.length;
  const pendingPercentage = (pending.length / totalTask) * 100;
  const ongoingPercentage = (ongoing.length / totalTask) * 100;
  const completedPercentage = (completed.length / totalTask) * 100;
  return (
    <>
      <SingleSprintOverview
        _id={_id}
        completed={completed}
        endTime={endTime}
        ongoing={ongoing}
        pending={pending}
        projectId={projectId}
        sprintNo={sprintNo}
        startTime={startTime}
        velocity={velocity}
      />
      <div className='sprintOverview__chartSection'>
        <div className='sprintOverview__sprintHeader'>Sprint Progress</div>
        <div className='sprintOverview__chartInfo'>
          <div className='sprintOverview__chartInfoGroup'>
            <div className='sprintOverview__pendingColor'></div>
            <div className='sprintOverview__chartInfoText'>
              Pending {pendingPercentage.toString().substring(0, 5) || 0}%
            </div>
          </div>
          <div className='sprintOverview__chartInfoGroup'>
            <div className='sprintOverview__ongoingColor'></div>
            <div className='sprintOverview__chartInfoText'>
              Ongoing {ongoingPercentage.toString().substring(0, 5) || 0}%
            </div>
          </div>
          <div className='sprintOverview__chartInfoGroup'>
            <div className='sprintOverview__completedColor'></div>
            <div className='sprintOverview__chartInfoText'>
              Completed {completedPercentage.toString().substring(0, 5) || 0}%
            </div>
          </div>
        </div>

        <TaskProgress fromSprint={true} data={data2} datakey='value' />
      </div>
    </>
  );
};

export default CurrentSprintOverview;