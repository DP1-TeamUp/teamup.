import React from 'react';
import './Sidebar.css';
import DashboardIcon from '@material-ui/icons/Dashboard';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import BrushIcon from '@material-ui/icons/Brush';
import GroupIcon from '@material-ui/icons/Group';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import NoteIcon from '@material-ui/icons/Note';
import { NavLink, useParams } from 'react-router-dom';
import { useStateValue } from '../../StateProvider/StateProvider';

const Sidebar = () => {
  const [{ project }, dispatch] = useStateValue();
  const { projectId } = useParams();
  const { roomId } = useParams();
  const projectID = project.id || projectId;

  const collabboardRoute = roomId
    ? `/room/${roomId}`
    : `/collabboard/${projectID}`;

  return (
    <div className='sidebar'>
      <div className='sidebar__container'>
        <NavLink
          to={`/dashboard/${projectID}`}
          activeStyle={{ color: '#ff8c42' }}
          className='sidebar__tab'>
          <div className='sidebar__tabIcon'>
            <DashboardIcon />
          </div>
          <div className='sidebar__tabText'>Dashboard</div>
        </NavLink>
        <NavLink
          to={`/taskboard/${projectID}`}
          activeStyle={{ color: '#ff8c42' }}
          className='sidebar__tab'>
          <div className='sidebar__tabIcon'>
            <LibraryBooksIcon />
          </div>
          <div className='sidebar__tabText'>Epics & Backlog</div>
        </NavLink>
        <NavLink
          to={`/scrumboard/${projectID}`}
          activeStyle={{ color: '#ff8c42' }}
          className='sidebar__tab'>
          <div className='sidebar__tabIcon'>
            <NoteIcon />
          </div>
          <div className='sidebar__tabText'>Sprint</div>
        </NavLink>
        <NavLink
          to={collabboardRoute}
          activeStyle={{ color: '#ff8c42' }}
          className='sidebar__tab'>
          <div className='sidebar__tabIcon'>
            <BrushIcon />
          </div>
          <div className='sidebar__tabText'>Collab Board</div>
        </NavLink>
        <NavLink
          to={`/reports/${projectID}`}
          activeStyle={{ color: '#ff8c42' }}
          className='sidebar__tab'>
          <div className='sidebar__tabIcon'>
            <InsertChartIcon />
          </div>
          <div className='sidebar__tabText'>Reports</div>
        </NavLink>
        <NavLink
          to={`/team/${projectID}`}
          activeStyle={{ color: '#ff8c42' }}
          className='sidebar__tab'>
          <div className='sidebar__tabIcon'>
            <GroupIcon />
          </div>
          <div className='sidebar__tabText'>Team</div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
