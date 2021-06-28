import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../Components/Button/Button';
import CloseIcon from '@material-ui/icons/Close';
import BrushIcon from '@material-ui/icons/Brush';
import { create } from '../../API/taskBoard';
import { useStateValue } from '../../StateProvider/StateProvider';
import './AddBoard.css';

const AddBoard = (props) => {
  const [{ project }, dispatch] = useStateValue();

  const [color, setColor] = useState('');
  const [boardName, setBoardName] = useState('');

  const addboard = () => {
    const board = {
      name: boardName,
      color: color,
      project: project.id,
    };
    console.log(board);
    create(board).then((response) => {
      if (response.success) {
        console.log(response.message);
      } else {
        console.log(response.message);
      }
    });
    props.setOpenAddBoard();
  };

  return ReactDOM.createPortal(
    <div className='addboard'>
      <div className='addboard__container'>
        <div className='addboard__header'>
          <div className='addboard__title'>Board name</div>
          <div
            className='addboard__closeButton'
            onClick={props.setOpenAddBoard}>
            <CloseIcon />
          </div>
        </div>
        <input
          className='addboard__input'
          type='text'
          value={boardName}
          onChange={(e) => {
            setBoardName(e.target.value);
          }}
        />
        <div className='addboard__colorHeader'>Color</div>
        <div className='addboard__colorPalete'>
          <div className='addboard__singleColor'>
            <div
              className='red'
              onClick={(e) => {
                setColor(e.target.className);
              }}></div>
          </div>
          <div className='addboard__singleColor'>
            <div
              className='blue'
              onClick={(e) => {
                setColor(e.target.className);
              }}></div>
          </div>
          <div className='addboard__singleColor'>
            <div
              className='green'
              onClick={(e) => {
                setColor(e.target.className);
              }}></div>
          </div>
          <div className='addboard__singleColor'>
            <div
              className='aqua'
              onClick={(e) => {
                setColor(e.target.className);
              }}></div>
          </div>
          <div className='addboard__singleColor'>
            <div
              className='purple'
              onClick={(e) => {
                setColor(e.target.className);
              }}></div>
          </div>
          <div className='addboard__singleColor'>
            <div
              className='pink'
              onClick={(e) => {
                setColor(e.target.className);
              }}></div>
          </div>
          <div className='addboard__singleColor'>
            <div
              className='yellow'
              onClick={(e) => {
                setColor(e.target.className);
              }}></div>
          </div>
          <div className={`addboard__brush ${color}`}>
            <BrushIcon />
          </div>
        </div>
        <div className='addboard__button'>
          <Button onClick={addboard}>Add Board</Button>
        </div>
      </div>
    </div>,
    document.getElementById('addboard')
  );
};

export default AddBoard;
