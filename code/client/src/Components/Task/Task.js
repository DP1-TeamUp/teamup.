import React from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

import './Task.css';

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    fontSize: '1vw',
  },
}));

const Task = () => {
  const classes = useStyles();
  return (
    <div className='task'>
      <div className='bullet'>
        <div className='red'></div>
      </div>

      <div className='task__text'>
        As a user i want to pay using card asa asa asa{' '}
      </div>

      <div className='task__image'>
        <Avatar className={classes.purple}>N</Avatar>
      </div>
    </div>
  );
};

export default Task;