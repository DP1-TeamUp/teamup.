import React, { useState, useEffect, useRef } from 'react';
import './VideoFeed.css';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { useHistory, useParams } from 'react-router';
import Scrollable from '../Scrollable/Scrollable';
import VideoStreamPreview from '../VideoStreamPreview/VideoStreamPreview';
import styled from 'styled-components';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { useStateValue } from '../../StateProvider/StateProvider';

const StyledVideo = styled.video`
  height: 31%;
  width: 100%;
  background-color: #252525;
  margin-bottom: 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2.5vh;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight,
  width: window.innerWidth,
};

const VideoFeed = () => {
  const history = useHistory();
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(false);
  const [peers, setPeers] = useState([]);

  const [state, dispatch] = useStateValue();
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const { roomId } = useParams();
  const user = JSON.parse(sessionStorage.getItem('jwt'));

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4050');

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: audio })
      .then((stream) => {
        //userVideo.current.srcObject = stream;
        socketRef.current.emit('join room', roomId, user.user._id);

        socketRef.current.on('all users', (users) => {
          const peers = [];
          console.log('USERS IN FEED', users);
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on('user joined', (payload) => {
          console.log('user joined');
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
    return () => {
      socketRef.current.disconnect();
      //console.log(peersRef.current[0]);
      peersRef.current[0].peer.destroy();
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: audio })
      .then((stream) => {
        if (video) {
          userVideo.current.srcObject = stream;
        }
      });
  }, [video]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    console.log('create peer');
    peer.on('signal', (signal) => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        callerID,
        signal,
      });
    });
    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    console.log('add peer');
    peer.on('signal', (signal) => {
      socketRef.current.emit('returning signal', {
        signal,
        callerID,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  return (
    <div className='videoFeed' style={{ color: 'white' }}>
      <div className='videoFeed__streams'>
        <Scrollable>
          {video ? (
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
          ) : (
            <VideoStreamPreview />
          )}
          {peers.map((peer, index) => {
            return <Video key={index} peer={peer} />;
          })}
        </Scrollable>
      </div>
      <div className='videoFeed__buttons'>
        <div
          className='videoFeed__videoButton'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setAudio(!audio);
          }}>
          {audio ? <MicIcon /> : <MicOffIcon />}
        </div>
        <div
          className='videoFeed__micButton'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setVideo(!video);
          }}>
          {video ? <VideocamIcon /> : <VideocamOffIcon />}
        </div>
        <div
          className='videoFeed__disconnectButton'
          onClick={() => {
            socketRef.current.disconnect();
            //console.log(peersRef.current[0]);
            peersRef.current[0].peer.destroy();
            setVideo(false);
            setAudio(false);
            history.push(`/collabboard/${roomId}`);
          }}
          style={{ color: 'red', cursor: 'pointer' }}>
          <CallEndIcon />
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
