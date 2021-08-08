import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import './ArtBoard.css';

const ArtBoard = () => {
  const [input, setInput] = useState('');
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  const socketRef = useRef();
  const projectId = useParams();

  const sendPitcher = (e) => {
    e.preventDefault();
    console.log('submit');
  };

  useEffect(() => {
    console.log(projectId);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const colors = document.getElementsByClassName('color');

    let current = {
      color: 'black',
    };

    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1];
    };

    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }

    let drawing = false;

    const drawLine = (x0, y0, x1, y1, color, emit) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      if (color === '#f2f2f2') {
        context.lineWidth = 40;
      } else {
        context.lineWidth = 4;
      }
      //context.lineWidth = 4;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      socketRef.current.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
        projectId,
      });
    };

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX;
      current.y = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!drawing) {
        return;
      }
      drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
      current.x = e.clientX;
      current.y = e.clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    };

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize, false);
    onResize();

    const onDrawingEvent = (data) => {
      const w = canvas.width;
      const h = canvas.height;
      if (data.projectId.projectId === projectId.projectId) {
        drawLine(
          data.x0 * w,
          data.y0 * h,
          data.x1 * w,
          data.y1 * h,
          data.color
        );
      }
    };
    socketRef.current = io.connect('http://localhost:4000/');
    socketRef.current.on('drawing', onDrawingEvent);
  }, []);

  return (
    <div className='artboard'>
      <canvas className='artboard__container' ref={canvasRef}></canvas>
      <div className='artboard__settings'>
        {/*<div className='artboard__label'>Colors</div>*/}
        <div ref={colorsRef} className='colors'>
          <div className='color black black' />
          <div className='color red red' />
          <div className='color green green' />
          <div className='color blue blue' />
          <div className='color #f2f2f2 white' />
        </div>

        {/*<div className='artboard__label'>Text pitchers</div>*/}
        <form className='input_container'>
          <input
            className='input'
            type='text'
            id='name'
            name='name'
            value={input}
            placeholder='Enter pitcher'
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            className='pitcher_button'
            onClick={sendPitcher}
            type='submit'>
            Send a message
          </button>
        </form>
      </div>

      {/*<div className='artboard__File'>
        <TextFieldsIcon />
        <form className='input_container'>
          <input
            className='input'
            type='text'
            id='name'
            name='name'
            value={input}
            placeholder='Enter pitcher name'
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            className='pitcher_button'
            onClick={sendPitcher}
            type='submit'>
            Send a message
          </button>
        </form>
      </div>
      <div className='artboard__Image'>
        <ImageIcon />
        </div>*/}
    </div>
  );
};

export default ArtBoard;
