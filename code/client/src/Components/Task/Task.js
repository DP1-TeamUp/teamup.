import React, { useState } from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UpdateTask from '../../Modals/UpdateTask/UpdateTask';
import Scrollable from '../Scrollable/Scrollable';

import './Task.css';

const useStyles = makeStyles((theme) => ({
  purple: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const Task = (props) => {
  const classes = useStyles();

  let activeClassName =
    props.status === 'Pending' ? 'not_active' : 'yes_active';
  activeClassName = props.status === 'completed' ? 'done' : activeClassName;

  let activeClassText = props.status === 'Pending' ? 'inactive' : 'active';
  activeClassText = props.status === 'completed' ? 'done' : activeClassText;

  const [openUpdateTask, setOpenUpdateTask] = useState(false);

  return (
    <>
      {openUpdateTask && props.fromEpic && props.status !== 'completed' && (
        <UpdateTask
          _id={props._id}
          points={props.points}
          assignedTo={props.assignedTo}
          close={() => {
            setOpenUpdateTask(false);
            props.switchReloadSignal();
          }}
          story={props.story}
          sprintNo={props.sprintNo}
          sprintId={props.sprintId}
        />
      )}
      <div
        className={`task ${props.evenly}`}
        onClick={() => {
          setOpenUpdateTask(true);
        }}>
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
    </>
  );
};

export default Task;