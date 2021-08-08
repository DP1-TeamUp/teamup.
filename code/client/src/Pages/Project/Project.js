import React, { useState } from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Project.css';
import DropDown from '../../Components/DropDown/DropDown';
import NewProject from '../../Modals/NewProject/NewProject';
import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import Profile from '../../Modals/Profile/Profile';

const useStyles = makeStyles((theme) => ({
  purple: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

const Project = () => {
  const classes = useStyles();
  const user = JSON.parse(sessionStorage.getItem('jwt'));
  const [openForm, setOpenForm] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [message, setMessage] = useState('');
  const [loadinga, setLoadinga] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div className='project'>
      {loadinga && <Spinkit />}
      {openProfile && (
        <Profile
          openProfile={openProfile}
          closeProfile={() => {
            setOpenProfile(!setOpenProfile);
          }}
        />
      )}
      {openForm && (
        <NewProject
          close={() => {
            setOpenForm(!openForm);
          }}
          admin={user.user._id}
          setMessage={(str) => setMessage(str)}
          setOpenResponse={() => {
            setOpenResponse(!openResponse);
          }}
          setLoading={() => setLoadinga(!loadinga)}
        />
      )}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => setOpenResponse(false)}
        />
      )}

      <div className='project__navbar'>
        <div className='project__logo'>teamup.</div>
        <div
          className='project__accountInfo'
          onClick={() => {
            setOpenProfile(true);
          }}>
          <Avatar
            className={classes.purple}
            src={`http://localhost:5000/${user.user.image}`}
          />

          <div className='project__name'>
            {user ? user.user.username : 'Nafiz'}
          </div>
        </div>
      </div>
      <div className='project__content'>
        <div className='project__contentText'>
          <div>Create projects or collaborate</div>
          <div>with your team</div>
        </div>
        <div className='project__buttondiv'>
          <div className='project__buttondrop'>
            <DropDown />
          </div>
          <div className='project__smallText'>Or</div>
          <button
            className='project__button'
            onClick={() => {
              setOpenForm(true);
            }}>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;
