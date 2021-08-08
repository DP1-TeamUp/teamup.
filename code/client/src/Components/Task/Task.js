import React from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import './Task.css';

const useStyles = makeStyles((theme) => ({
  purple: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const Task = (props) => {
  const classes = useStyles();
  const activeClassName =
    props.status === 'Pending' ? 'not_active' : 'yes_active';
  const activeClassText = props.status === 'Pending' ? 'Not active' : 'active';
  return (
    <div className={`task ${props.evenly}`}>
      <div className={`bullet ${props.noMargin}`}>
        <div className={props.color}></div>
      </div>

      <div className={`task__text ${props.smallText} ${props.putWhitespace}`}>
        {props.story}
      </div>

      <div className={`task__image ${props.noDisplay}`}>
        <Avatar
          className={classes.purple}
          src={`http://localhost:5000/${props.image}`}
        />
        <div className={`${activeClassName} ${props.noStatus}`}>
          {activeClassText}
        </div>
      </div>
    </div>
  );
};

export default Task;
