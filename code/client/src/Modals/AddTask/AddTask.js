import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './AddTask.css';
import CloseIcon from '@material-ui/icons/Close';
import Button from '../../Components/Button/Button';
import { useParams } from 'react-router-dom';
import { listAllMembers } from '../../API/project';
import Spinkit from '../Spinkit/Spinkit';
import ResponseModal from '../ResponseModal/ResponseModal';
import { create, getSuggestions } from '../../API/task';
import { useHistory } from 'react-router';
import SuggestUserModal from '../SuggestionModal/SuggestUserModal';

const AddTask = (props) => {
  const { projectId } = useParams();
  const members = [{ _id: 1, email: 'None' }];
  const [toBeAssigned, setToBeAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [suggested, setSuggested] = useState([]);
  const [openResponse, setOpenResponse] = useState(false);
  const [openSuggestResponse, setOpenSuggestResponse] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');
  const [story, setStory] = useState('');
  const [points, setPoints] = useState(3);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    listAllMembers(projectId).then((response) => {
      console.log(response);
      if (response.success) {
        response.members.map((member) => members.push(member));
        setToBeAssigned(members);
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  }, []);

  const selectMember = (event) => {
    setAssignedTo(event.target.value);
  };

  const submitHandler = () => {
    setLoading(true);
    const body = {
      boardId: props.boardId,
      color: props.color,
      story,
      points,
      assignedTo,
      projectId,
      status: 'Pending',
    };
    create(body).then((response) => {
      console.log(response);
      if (response.success) {
        setLoading(false);
        history.push(`/taskboard/${projectId}`);
        props.closeAddTask();
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  };

  const getSuggestionsClicked = () => {
    setLoading(true);
    const body = {
      task: story,
      projectId,
    };
    getSuggestions(body).then((response) => {
      if (response.success) {
        setSuggested(response.finalNicknames);
        if (response.finalNicknames.length === 0) {
          setMessage('Could not suggest anyone');
        }
        setOpenSuggestResponse(true);
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  };

  return ReactDOM.createPortal(
    <div className='addTask'>
      {loading && <Spinkit />}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => setOpenResponse(false)}
        />
      )}
      {openSuggestResponse && (
        <SuggestUserModal
          suggested={suggested}
          message={message}
          setOpen={() => setOpenSuggestResponse(false)}
        />
      )}
      <div className='addTask__container'>
        <div className='addTask__closeButton' onClick={props.closeAddTask}>
          <CloseIcon />
        </div>
        <div className='addTask__storyContainer'>
          <div className='addTask__title'>Story Name</div>
          <textarea
            row='2'
            className='addTask__input'
            value={story}
            onChange={(event) => {
              setStory(event.target.value);
            }}
          />
        </div>
        <div className='addTask__memberContainer'>
          <div className='addTask__member'>
            <div className='addTask__title'>Assign Member</div>
            <select className='addTask__selector' onChange={selectMember}>
              {toBeAssigned.map((member) => (
                <option
                  key={member._id}
                  value={member._id}
                  className='addTask__option'>
                  {member.email}
                </option>
              ))}
            </select>
          </div>
          <div
            className='addTask__getSuggestions'
            onClick={getSuggestionsClicked}>
            Get suggestions
          </div>
        </div>
        <div className='addTask__title'>Story Points</div>
        <input
          className='addTask__storyPoint'
          type='number'
          value={points}
          onChange={(event) => {
            setPoints(event.target.value);
          }}
        />
        <div className='addTask__button'>
          <Button onClick={submitHandler}>Add Story</Button>
        </div>
      </div>
    </div>,
    document.getElementById('addTask')
  );
};

export default AddTask;