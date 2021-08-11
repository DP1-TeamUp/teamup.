import React from 'react';
import './Reports.css';
import BigDropDown from '../../Components/BigDropDown/BigDropDown';
import OverLoadChart from '../../Components/Charts/OverloadChart';
import TaskProgress from '../../Components/Charts/TaskProgress';

const Reports = () => {
  const chartData = [
    { name: 'A', value: 20, fill: '#2D2D2D' },
    { name: 'B', value: 25, fill: '#00AAF2' },
  ];

  const data2 = [
    { name: 'A', value: 8, fill: '#2D2D2D' },
    { name: 'B', value: 25, fill: '#00AAF2' },
    { name: 'C', value: 30, fill: '#8F44FD' },
  ];

  return (
    <div className='reports'>
      <div className='reports__navbar'>
        <BigDropDown />
      </div>
      <div className='reports__content'>
        <div className='reports__firstRow'>
          <div className='reports__rowOneChart'>
            <div className='reports__rowOneTitle'>Task Completion</div>
            <div className='reports__rowOneContent'>
              <TaskProgress data={chartData} datakey='value' />
            </div>
          </div>

          <div className='reports__rowOneChart'>
            <div className='reports__rowOneTitle'>Task Division</div>
            <div className='reports__rowOneContent'>
              <TaskProgress fromReport={true} data={data2} datakey='value' />
            </div>
          </div>
          <div className='reports__rowOneChart'>
            <div className='reports__rowOneTitle'>Work Load</div>
            <div className='reports__rowOneContent'>
              <OverLoadChart />
            </div>
          </div>
        </div>
        <div className='reports__secondRow'>
          <div className='reports__rowTwoChart'>
            <div className='reports__rowOneTitle'>Sprint Velocity</div>
          </div>
          <div className='reports__rowTwoChart'>
            <div className='reports__rowOneTitle'>Area Chart</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;