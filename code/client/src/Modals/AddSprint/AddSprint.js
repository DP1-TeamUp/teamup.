import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../Components/Button/Button';
import { useParams } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import Spinkit from '../Spinkit/Spinkit';
import ResponseModal from '../ResponseModal/ResponseModal';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import './AddSprint.css';
import { create } from '../../API/sprint';

const AddSprint = (props) => {
  const { projectId } = useParams();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openResponse, setOpenResponse] = useState(false);
  const [duration, setDuration] = useState(7);
  const everyDuration = [
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28,
  ];

  const createSprint = () => {
    setLoading(true);
    let sDate = new Date(startDate);
    let myDate = new Date(sDate.getTime() + duration * 24 * 60 * 60 * 1000);
    const body = {
      sprintNo: props.sprintNo + 1,
      startTime: sDate,
      endTime: myDate,
      projectId: projectId,
    };
    console.log(body);
    create(body).then((response) => {
      if (response.success) {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  };
  return ReactDOM.createPortal(
    <div className='addSprint'>
      {loading && <Spinkit />}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => {
            setOpenResponse(false);
            props.closeAddSprint();
          }}
        />
      )}
      <div className='addSprint__container pop__up'>
        <div className='addTask__closeButton' onClick={props.closeAddSprint}>
          <CloseIcon />
        </div>
        <div className='addSprint__sprintName'>{`Sprint ${
          props.sprintNo + 1
        }`}</div>
        <div className='addSprint__time'>
          <div className='addSprint__sprintName'>Start Time</div>
          <input
            type='datetime-local'
            name='datetime'
            value={startDate}
            className='addSprint__dateInput'
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
          />
        </div>
        <div className='addSprint__time'>
          <div className='addSprint__sprintName'>Sprint Duration</div>
          <div className='addSprint__radioBox'>
            <ArrowLeftIcon />
            <div className='addSprint__radioBoxContainer'>
              {everyDuration.map((oneDuration) => (
                <div
                  className={`${
                    duration === oneDuration
                      ? 'addSprint__radioActive'
                      : 'addSprint__radio'
                  }`}
                  onClick={() => {
                    setDuration(oneDuration);
                  }}>
                  {oneDuration}
                </div>
              ))}
            </div>
            <ArrowRightIcon />
          </div>
        </div>

        <div className='addSprint__buttonContainer'>
          <Button size='small' onClick={createSprint}>
            Add Sprint
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById('addSprint')
  );
};

export default AddSprint;
