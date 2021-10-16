import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { Avatar } from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import Scrollable from '../../Components/Scrollable/Scrollable';
import { isAuthenticated } from '../../API/auth-helper';
import { update, addSkill, deleteSkill } from '../../API/user';
import { signout } from '../../API/auth';
import { useHistory } from 'react-router-dom';
import Spinkit from '../Spinkit/Spinkit';
import ResponseModal from '../ResponseModal/ResponseModal';
import ClearIcon from '@material-ui/icons/Clear';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import './Profile.css';

const Profile = (props) => {
  const history = useHistory();
  const user = JSON.parse(sessionStorage.getItem('jwt'));
  const jwt = isAuthenticated();
  const image = `http://localhost:5000/${user.user.image}`;
  const [previewUrl, setPreviewUrl] = useState(image);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [focusChanged, setFocusChanged] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skillSet, setSkillSet] = useState(user.user.skills);
  const [slideOut, setSlideOut] = useState('');

  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const handleImage = async (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }

    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    update({ userId: user.user._id }, { t: jwt.token }, formData).then(
      (response) => {
        console.log(response);
        if (response.success) {
          user.user.image = response.user.image;
          sessionStorage.setItem('jwt', JSON.stringify(user));
        }
      }
    );
  };

  const slide = props.openProfile ? 'slide__in' : 'slide__out';

  useEffect(() => {
    console.log(user);
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const logout = () => {
    setLoading(true);
    signout().then((response) => {
      if (response.success) {
        history.push('/signin');
        sessionStorage.removeItem('jwt');
        setLoading(false);
      } else {
        setMessage('Failed to Logout');
        setOpen(true);
        setLoading(false);
      }
    });
  };

  const handleNewSkill = (e) => {
    setNewSkill(e.target.value);
  };

  const submitNewSkill = () => {
    const body = {
      skill: newSkill,
      userId: user.user._id,
    };
    setLoading(true);
    addSkill(body).then((response) => {
      if (response.success) {
        user.user.skills.push(newSkill);
        setSkillSet(user.user.skills);
        sessionStorage.setItem('jwt', JSON.stringify(user));
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpen(true);
        setLoading(false);
      }
      setNewSkill('');
    });
  };

  const removeSkill = (skillToBeDeleted) => {
    let body = {
      skill: skillToBeDeleted,
      userId: user.user._id,
    };
    setLoading(true);
    deleteSkill(body).then((response) => {
      if (response.success) {
        let filteredSkills = user.user.skills.filter(
          (aSkill) => aSkill !== skillToBeDeleted
        );
        user.user.skills = filteredSkills;
        setSkillSet(user.user.skills);
        sessionStorage.setItem('jwt', JSON.stringify(user));
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpen(true);
        setLoading(false);
      }
    });
  };

  return ReactDOM.createPortal(
    <div className='profile'>
      {loading && <Spinkit />}
      {open && (
        <ResponseModal setOpen={() => setOpen(false)} message={message} />
      )}
      <div className={`profile__container ${slide} ${slideOut}`}>
        <div
          className='profile__closeButton'
          onClick={() => {
            setSlideOut('slideOut');
            setTimeout(function () {
              props.closeProfile();
            }, 300);
          }}>
          <DoubleArrowIcon />
        </div>
        <div className='profile__imageSection'>
          <input
            style={{ display: 'none' }}
            ref={filePickerRef}
            type='file'
            className='newProduct__input'
            id='image'
            name='image'
            placeholder='Choose the image'
            accept='.jpg,.png,.jpeg'
            onChange={handleImage}
          />
          <Avatar
            style={{ width: '9.4vw', height: '19.7vh' }}
            src={previewUrl}
          />
          <div className='profile__circle' onClick={pickImageHandler}>
            <div className='profile__addPictureButton'>
              <AddAPhotoIcon style={{ width: '2.75vw', height: '5.5vh' }} />
            </div>
          </div>
        </div>
        <div className='profile__fullName'>{`${user.user.name}`}</div>
        <div className='profile__info'>
          <div className='profile__infoTitle'>Personal Info</div>
          <div className='profile__infoData'>
            Username: {user.user.username}
          </div>
          <div className='profile__infoData'>Email: {user.user.email}</div>
          <div className='profile__infoTitle'>Project(s)</div>
          {user.user.projects.length !== 0 &&
            user.user.projects.map((project) => (
              <div className='profile__infoData'>{project.name}</div>
            ))}

          <div className='profile__infoTitle'>Proficiency</div>
          <div className={`profile__tagInputContainer ${focusChanged}`}>
            <input
              onFocus={() => {
                setFocusChanged('whiteBorder');
              }}
              onBlur={() => {
                setFocusChanged('');
              }}
              className='profile__tagInput'
              type='text'
              placeholder='Add a new skill'
              value={newSkill}
              onChange={handleNewSkill}
            />
            <div className='profile__tagIcon' onClick={submitNewSkill}>
              <AddCircleOutlineIcon />
            </div>
          </div>
          <div className='profile__tagContainerLength'>
            <Scrollable>
              <div className='profile__tagContainer'>
                {skillSet.length !== 0 &&
                  skillSet.map((oneSkill) => (
                    <div className='profile__tag'>
                      <div>{oneSkill}</div>
                      <div
                        className='profile__tagIcon'
                        onClick={() => {
                          removeSkill(oneSkill);
                        }}>
                        <ClearIcon style={{ fontSize: '1vw' }} />
                      </div>
                    </div>
                  ))}
              </div>
            </Scrollable>
          </div>
        </div>
        <div className='logoutButton' onClick={logout}>
          Logout
        </div>
      </div>
    </div>,
    document.getElementById('profile')
  );
};

export default Profile;
