import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './VerificationCode.css';
import CloseIcon from '@material-ui/icons/Close';
import Button from '../../Components/Button/Button';
import { emailVerification } from '../../API/auth';
import { create } from '../../API/user';
import { useParams } from 'react-router-dom';
import ResponseModal from '../ResponseModal/ResponseModal';
import Spinkit from '../Spinkit/Spinkit';
import { isAuthenticated } from '../../API/auth-helper';
import { useHistory } from 'react-router-dom';

const VerificationCode = (props) => {
  let history = useHistory();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [message, setMessage] = useState('');

  const addMember = () => {
    setLoading(true);
    const body = {
      email: props.email,
      name: props.name,
      password: props.password,
      username: props.username,
      verificationCode: code,
    };
    create(body).then((response) => {
      if (response.success) {
        setLoading(false);
        history.push('/signin');
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  };
  return ReactDOM.createPortal(
    <div className='addMember'>
      {loading && <Spinkit />}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => {
            setOpenResponse(false);
            props.setOpen();
          }}
        />
      )}
      <div className='addMember__form pop__up'>
        <div className='addMember__top'>
          <div className='addMember__label'>Verification Code</div>
          <div className='addMember__closeIcon' onClick={props.setOpen}>
            <CloseIcon />
          </div>
        </div>
        <input
          className='addMember__input'
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          placeholder='8 digits'
        />
        <Button onClick={addMember} size='small'>
          Verify
        </Button>
      </div>
    </div>,
    document.getElementById('verificationCode')
  );
};

export default VerificationCode;
