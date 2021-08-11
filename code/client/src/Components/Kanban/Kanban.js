import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import Scrollable from '../Scrollable/Scrollable';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';
import { useParams } from 'react-router-dom';
import { getSprintDetails } from '../../API/sprint';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import { updateTaskFromKanban } from '../../API/task';

import './Kanban.css';

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    fontSize: '3vh',
  },
}));

const Kanban = () => {
  const classes = useStyles();
  const { sprintId } = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [columns, setColumns] = useState([]);

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];

      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

      //testing

      const body = {
        taskId: removed._id,
        sprintId: sprintId,
        destName: destColumn.name,
        sourceName: sourceColumn.name,
      };

      setLoading(true);
      updateTaskFromKanban(body).then((response) => {
        console.log(response);
        if (response.success) {
          setLoading(false);
        } else {
          setMessage(response.message);
          setOpen(true);
          setLoading(false);
        }
      });

      console.log(body);

      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    let body = {
      sprintId,
    };
    getSprintDetails(body).then((response) => {
      if (response.success) {
        setColumns({
          [uuidv4()]: {
            name: 'Pending',
            items: response.sprint.pending,
          },
          [uuidv4()]: {
            name: 'Ongoing',
            items: response.sprint.ongoing,
          },
          [uuidv4()]: {
            name: 'Completed',
            items: response.sprint.completed,
          },
        });
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpen(true);
        setLoading(false);
      }
    });
  }, [open]);

  return (
    <div className='kanban'>
      {loading && <Spinkit />}

      {open && (
        <ResponseModal
          message={message}
          setOpen={() => {
            setOpen(false);
          }}
        />
      )}
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className='kanban__columnSpace' key={columnId}>
              <div className='kanban__columnHeader'>{column.name}</div>
              <div className='kanban__columnBody'>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <Scrollable>
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? '#3a3b3c'
                              : '#252525',
                            width: '100%',
                            minHeight: '100%',
                          }}>
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item._id}
                                draggableId={item._id}
                                index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        padding: '1vh 0.8vw',
                                        margin: '0 0 0 0',
                                        minHeight: '1vh',
                                        borderRadius: '1vh',
                                        backgroundColor: snapshot.isDragging
                                          ? '#525252'
                                          : '#252525',
                                        color: 'white',
                                        ...provided.draggableProps.style,
                                      }}>
                                      <div className='task '>
                                        <div className='bullet noMargin'>
                                          <div className={item.color}></div>
                                        </div>
                                        <div className={`task__text  `}>
                                          {item.story}
                                        </div>

                                        <Avatar
                                          className={classes.purple}
                                          src={`http://localhost:5000/${item.assignedTo.image}`}
                                        />
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                          {column.items.length === 0 && (
                            <div className='empty__Kanban'>{`No ${column.name} Stories`}</div>
                          )}
                        </div>
                      </Scrollable>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default Kanban;