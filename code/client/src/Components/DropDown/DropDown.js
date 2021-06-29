import React, { useState, useEffect } from 'react';
import { findProjectByUserId } from '../../API/project';
import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import { useHistory, useParams } from 'react-router-dom';
import { useStateValue } from '../../StateProvider/StateProvider';
import './Dropdown.css';

const DropDown = () => {
  const { projectId } = useParams();
  const history = useHistory();
  const [{ project, user }, dispatch] = useStateValue();
  const [projectName, setProjectName] = useState('Choose Project');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setLoading(true);
    console.log('CALLED');
    findProjectByUserId(user._id).then((response) => {
      if (response.success) {
        console.log(response);
        setProjects(response.projects);

        //verify project use
        projects.map((aProjectFromResponse) => {
          if (aProjectFromResponse._id === projectId) {
            console.log('response', aProjectFromResponse.name);
            initialProjectSearch(aProjectFromResponse.name);
          }
        });
        if (projectName === 'Choose Project' && !project.name) {
          history.push('/project');
        }
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  }, []);

  const initialProjectSearch = async (name) => {
    setProjectName(name);
    await dispatch({
      type: 'SELECTED_PROJECT',
      project: {
        name: name,
        id: projectId,
      },
    });
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProject = async (e) => {
    history.push(`/dashboard/${e.target.id}`);
    await dispatch({
      type: 'SELECTED_PROJECT',
      project: {
        name: e.currentTarget.textContent,
        id: e.target.id || projectId,
      },
    });
  };

  const itemList = (props) => {
    const list = props.map((item) => (
      <div
        onClick={handleProject}
        className='dropdown__item'
        key={item._id}
        id={item._id}>
        {item.name}
      </div>
    ));

    return <div className='dropdown__items'> {list} </div>;
  };

  return (
    <div
      className={isOpen ? 'dropdown active' : 'dropdown'}
      onClick={handleClick}>
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => setOpenResponse(false)}
        />
      )}
      {loading && <Spinkit />}
      <div className='dropdown__text'>
        {!project.name ? projectName : project.name}
      </div>
      {itemList(projects)}
    </div>
  );
};

export default DropDown;