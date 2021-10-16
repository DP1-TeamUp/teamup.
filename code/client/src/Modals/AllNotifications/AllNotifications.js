import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './AllNotifications.css';
import SingleNotice from './SingleNotice';
import { deleteNotifications } from '../../API/user';

const AllNotifications = (props) => {
  const user = JSON.parse(sessionStorage.getItem('jwt'));
  useEffect(() => {
    return () => {
      deleteNotifications(user.user._id).then((response) => {
        console.log(response);
      });
    };
  }, []);
  return ReactDOM.createPortal(
    <div className='allNotifications'>
      <div className='notification__container'>
        {props.notifications.map((dum) => (
          <SingleNotice
            projectName={dum.project}
            subject={dum.subject}
            notification={dum.content}
          />
        ))}
      </div>
    </div>,
    document.getElementById('notificationPortal')
  );
};

export default AllNotifications;
