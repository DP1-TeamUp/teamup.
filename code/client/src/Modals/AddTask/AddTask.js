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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { isAuthenticated } from '../../API/auth-helper';

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
  const [assignedEmail, setAssignedEmail] = useState('None');
  const [story, setStory] = useState('');
  const [points, setPoints] = useState(3);
  const [showDropDown, setShowDropDown] = useState(false);
  const [pop, setPop] = useState('pop__up');

  const jwt = isAuthenticated();

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
    create({ t: jwt.token }, body).then((response) => {
      console.log(response);
      if (response.success) {
        setLoading(false);
        history.push(`/taskboard/${projectId}`);
        setPop('pop__down');
        setTimeout(() => {
          props.closeAddTask();
        }, 500);
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
          selectEmail={(email) => {
            setAssignedEmail(email);
          }}
          selectId={(id) => {
            setAssignedTo(id);
          }}
        />
      )}
      <div className={`addTask__container ${pop}`}>
        <div
          className='addTask__closeButton'
          onClick={() => {
            setPop('pop__down');
            setTimeout(() => {
              props.closeAddTask();
            }, 500);
          }}>
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
            <div
              className='addTask__selector'
              onClick={() => {
                setShowDropDown(!showDropDown);
              }}>
              <div className='addTask__selectorText'>{assignedEmail}</div>
              <div className='addTask__selectorIcon'>
                {showDropDown ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </div>
            </div>
            {showDropDown && (
              <div className='addTask__options'>
                {toBeAssigned.map((member) => (
                  <div
                    className='addTask__option'
                    key={member._id}
                    value={member._id}
                    onClick={() => {
                      setAssignedTo(member._id);
                      setAssignedEmail(member.email);
                      setShowDropDown(!showDropDown);
                    }}>
                    {member.email}
                  </div>
                ))}
              </div>
            )}
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
          onChange={(e) => {
            if (e.target.value > 5) setPoints(5);
            else if (e.target.value < 1) setPoints(1);
            else setPoints(e.target.value);
          }}
        />
        <div className='addTask__button'>
          <Button
            onClick={() => {
              submitHandler();
            }}>
            Add Story
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById('addTask')
  );
};

export default AddTask;
