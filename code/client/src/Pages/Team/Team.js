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
import AddMember from '../../Modals/AddMember/AddMember';
import ConsentModal from '../../Modals/ConsentModal/ConsentModal';
import { removeMember } from '../../API/project';

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: '1vw',
  },
}));

const Team = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const [members, setMembers] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [message, setMessage] = useState('');
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openConsentModal, setOpenConsentModal] = useState(false);
  const [memberToBeRemovedName, setMemberToBeRemovedName] = useState('');
  const [memberToBeRemovedId, setMemberToBeRemovedId] = useState('');

  useEffect(() => {
    setLoading(true);

    listAllMembers(projectId).then((response) => {
      console.log(response);
      if (response.success) {
        setMembers(response.members);
        setAdmin(response.admin);
        setLoading(false);
      } else {
        setMessage(response.message);
        setOpenResponse(true);
        setLoading(false);
      }
    });
  }, [openAddMember, openConsentModal]);

  const removeMemberClicked = () => {
    setLoading(true);
    const body = {
      projectId: projectId,
      memberId: memberToBeRemovedId,
    };
    removeMember(body).then((response) => {
      setLoading(true);
      if (response.success) {
        setOpenConsentModal(false);
        setLoading(false);
      } else {
        setOpenConsentModal(false);
        setOpenResponse(true);
        setMessage(response.message);
        setLoading(false);
      }
    });
  };

  return (
    <div className='team'>
      {loading && <Spinkit />}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => setOpenResponse(false)}
        />
      )}
      {openAddMember && (
        <AddMember
          closeAddMember={() => {
            setOpenAddMember(false);
          }}
        />
      )}
      {openConsentModal && (
        <ConsentModal
          message={`Remove ${memberToBeRemovedName} from the team?`}
          answerNo={() => {
            setOpenConsentModal(false);
          }}
          answerYes={removeMemberClicked}
        />
      )}
      <div className='team__navbar'>
        <BigDropDown />
        <Button onClick={() => setOpenAddMember(true)}>Add Member</Button>
      </div>
      <div className='team__content'>
        <div className='team__contentLeft'>
          <div className='team__projectOwner'>
            <div className='team__header'>Team Lead</div>
            <div className='team__projectOwnerName'>
              <Avatar src={`http://localhost:5000/${admin.image}`} />
              <div className='team__memberName'>{admin.name}</div>
            </div>
          </div>
          <div className='team__collaborators slide__downC1'>
            <div className='team__header'>Collaborators</div>
            <div className='team__collaboratorsContent'>
              <Scrollable>
                <div className='team__members'>
                  {members.map((member) => (
                    <div className='team__member' key={member._id}>
                      <div className='team__profileGroup'>
                        <Avatar
                          className={classes.purple}
                          src={`http://localhost:5000/${member.image}`}
                        />
                        <div className='team__memberName'>{`${member.name}`}</div>
                      </div>
                      <div className='team__functions'>
                        <div className='team__buttondrop'>
                          <div className='team__buttondropText'>Member</div>
                          <div className='team__icon'>
                            <ExpandMoreIcon />
                          </div>
                        </div>
                        <ClearIcon
                          onClick={() => {
                            setMemberToBeRemovedName(member.name);
                            setMemberToBeRemovedId(member._id);
                            setOpenConsentModal(true);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Scrollable>
            </div>
          </div>
        </div>
        <div className='team__contentRight slide__downC3'>
          <div className='team__noProfile'>No Profile Selected</div>
        </div>
      </div>
    </div>
  );
};

export default Team;
