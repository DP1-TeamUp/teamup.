import React, { useState, useEffect } from 'react';
import './Taskboard.css';
import BigDropDown from '../../Components/BigDropDown/BigDropDown';
import Button from '../../Components/Button/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddBoard from '../../Modals/AddBoard/AddBoard';
import Task from '../../Components/Task/Task';
import Scrollable from '../../Components/Scrollable/Scrollable';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import { listTaskBoards } from '../../API/taskBoard';
import { useStateValue } from '../../StateProvider/StateProvider';
import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import { useParams } from 'react-router-dom';

const Taskboard = () => {
  const [{ project, boards }, dispatch] = useStateValue();
  const { projectId } = useParams();

  const [openAddBoard, setOpenAddBoard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    listTaskBoards(projectId).then((response) => {
      if (response.success) {
        console.log(response);
        dispatch({
          type: 'RETRIEVED_BOARDS',
          boards: response.boards,
        });
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpen(true);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className='taskboard'>
      {openAddBoard && (
        <AddBoard
          setOpenAddBoard={() => {
            setOpenAddBoard(false);
          }}
        />
      )}
      {loading && <Spinkit />}
      {open && (
        <ResponseModal
          message={message}
          setOpen={() => {
            setOpen(false);
          }}
        />
      )}
      <div className='taskboard__navbar'>
        <BigDropDown />
        <Button onClick={() => setOpenAddBoard(true)}>Add Board</Button>
      </div>
      <div className='taskboard__content'>
        {boards.map((board) => (
          <div className='taskboard__taskBoard' key={board._id}>
            <div className={board.color}>
              <div className='taskboard__header'>
                <div className='taskboard__headerText'>{board.name}</div>
                <AddCircleOutlineIcon />
              </div>
              <div className='taskboard__taskList'>
                <Scrollable>
                  <Task />
                  <Task />
                  <Task />
                  <Task />
                  <Task />
                  <Task />
                  <Task />
                </Scrollable>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Taskboard;