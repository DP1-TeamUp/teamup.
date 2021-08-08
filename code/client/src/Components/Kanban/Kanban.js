import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import Scrollable from '../Scrollable/Scrollable';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

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

const itemsFromBackend = [
  { id: uuidv4(), content: 'First task' },
  { id: uuidv4(), content: 'Second task' },
  { id: uuidv4(), content: 'Third task' },
  { id: uuidv4(), content: 'Fourth task' },
  { id: uuidv4(), content: 'Fifth task' },
  { id: uuidv4(), content: 'Last task' },
];

const columnsFromBackend = {
  [uuidv4()]: {
    name: 'Pending',
    items: itemsFromBackend,
  },
  [uuidv4()]: {
    name: 'Ongoing',
    items: [],
  },
  [uuidv4()]: {
    name: 'Completed',
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
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

const Kanban = () => {
  const classes = useStyles();

  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div className='kanban'>
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
                              ? '#525252'
                              : '#252525',
                            width: '100%',
                            minHeight: '100%',
                          }}>
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}>
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        padding: '1vh 1vw',
                                        margin: '0 0 1vh 0',
                                        minHeight: '1vh',
                                        backgroundColor: snapshot.isDragging
                                          ? '#FF8C42'
                                          : '#252525',
                                        color: 'white',
                                        ...provided.draggableProps.style,
                                      }}>
                                      <div className='task__div'>
                                        <div className='task__story'>
                                          <div className='task__color'></div>
                                          {item.content}
                                        </div>
                                        <Avatar className={classes.purple}>
                                          N
                                        </Avatar>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
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
