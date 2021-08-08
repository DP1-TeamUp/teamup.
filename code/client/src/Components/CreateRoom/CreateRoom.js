import React from 'react';
import './CreateRoom.css';
import Button from '../Button/Button';
import { useHistory, useParams } from 'react-router';
import Scrollable from '../Scrollable/Scrollable';
import VideoFeed from '../VideoFeed/VideoFeed';

const CreateRoom = () => {
  const history = useHistory();
  const { projectId } = useParams();
  const { roomId } = useParams();
  return (
    <div className='createRoom'>
      {roomId ? (
        <Scrollable>
          <VideoFeed />
        </Scrollable>
      ) : (
        <Button
          onClick={() => {
            history.push(`/room/${projectId}`);
          }}>
          Join Call
        </Button>
      )}
    </div>
  );
};

export default CreateRoom;
