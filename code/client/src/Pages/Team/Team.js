import React, { useEffect, useState } from 'react';
import './Team.css';
import BigDropDown from '../../Components/BigDropDown/BigDropDown';
import Button from '../../Components/Button/Button';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';
import Scrollable from '../../Components/Scrollable/Scrollable';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ClearIcon from '@material-ui/icons/Clear';
import { useParams } from 'react-router-dom';
import { listAllMembers } from '../../API/project';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import ResponseModal from '../../Modals/ResponseModal/ResponseModal';

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(3.2),
    height: theme.spacing(3.2),
    fontSize: '1vw',
  },
}));

const Team = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openResponse, setOpenResponse] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);

    listAllMembers(projectId).then((response) => {
      console.log(response);
      if (response.success) {
        setMembers(response.members);
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className='team'>
      {loading && <Spinkit />}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => setOpenResponse(false)}
        />
      )}
      <div className='team__navbar'>
        <BigDropDown />
        <Button>Add Member</Button>
      </div>
      <div className='team__content'>
        <div className='team__contentLeft'>
          <div className='team__projectOwner'>
            <div className='team__header'>Scrum Master</div>
            <div className='team__projectOwnerName'>
              <Avatar className={classes.purple}>N</Avatar>
              <div className='team__memberName'>Nafiz Imtiaz</div>
            </div>
          </div>
          <div className='team__collaborators'>
            <div className='team__header'>Collaborators</div>
            <div className='team__collaboratorsContent'>
              <Scrollable>
                <div className='team__members'>
                  {members.map((member) => (
                    <div className='team__member' key={member._id}>
                      <div className='team__profileGroup'>
                        <Avatar className={classes.purple}>
                          {member.name[0]}
                        </Avatar>
                        <div className='team__memberName'>{member.name}</div>
                      </div>
                      <div className='team__functions'>
                        <div className='team__buttondrop'>
                          <div className='team__buttondropText'>Member</div>
                          <div className='team__icon'>
                            <ExpandMoreIcon />
                          </div>
                        </div>
                        <ClearIcon />
                      </div>
                    </div>
                  ))}
                </div>
              </Scrollable>
            </div>
          </div>
        </div>
        <div className='team__contentRight'>
          <div className='team__noProfile'>No Profile Selected</div>
        </div>
      </div>
    </div>
  );
};

export default Team;