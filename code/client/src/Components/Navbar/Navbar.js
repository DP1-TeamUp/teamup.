import React, { useState } from 'react';
import Button from '../Button/Button';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import NotificationsIcon from '@material-ui/icons/Notifications';
import Profile from '../../Modals/Profile/Profile';
import './Navbar.css';

const useStyles = makeStyles((theme) => ({
  purple: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
  },
}));

const Navbar = () => {
  const user = JSON.parse(sessionStorage.getItem('jwt'));
  const [openProfile, setOpenProfile] = useState(false);

  const classes = useStyles();
  return (
    <div className='navbar'>
      {openProfile && (
        <Profile
          openProfile={openProfile}
          closeProfile={() => {
            setOpenProfile(!setOpenProfile);
          }}
        />
      )}
      <div className='navbar__logo'>teamup.</div>
      <div className='navbar__right'>
        <Button>+ New Project</Button>
        <div className='navbar__icon'>
          <NotificationsIcon style={{ fontSize: '2vw' }} />
        </div>
        <div
          className='navbar__profile'
          onClick={() => {
            setOpenProfile(true);
          }}>
          <Avatar
            className={classes.purple}
            src={`http://localhost:5000/${user.user.image}`}
          />

          <div className='project__name'>
            {user ? user.user.username : 'Nafiz Imtiaz'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
