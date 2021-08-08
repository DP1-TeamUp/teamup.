import React from 'react';

import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

import './VideoStreamPreview.css';

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(6),
    height: theme.spacing(6),
    fontSize: '1.5vw',
  },
}));

const VideoStreamPreview = () => {
  const classes = useStyles();

  return (
    <div className='videoStreamPreview'>
      <Avatar className={classes.purple}>N</Avatar>
    </div>
  );
};

export default VideoStreamPreview;
