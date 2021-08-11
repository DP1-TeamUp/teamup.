  
import React, { useState, useEffect } from 'react';
import BigDropDown from '../../Components/BigDropDown/BigDropDown';
import Button from '../../Components/Button/Button';
import AddSprint from '../../Modals/AddSprint/AddSprint';
import './SprintOverview.css';
import Scrollable from '../../Components/Scrollable/Scrollable';
import SingleSprintOverview from '../../Components/SingleSprintOverview/SingleSprintOverview';
import CurrentSprintOverview from '../../Components/SingleSprintOverview/CurrentSprintOverview';
import { getSprints } from '../../API/sprint';
import ResponseModal from '../../Modals/ResponseModal/ResponseModal';
import Spinkit from '../../Modals/Spinkit/Spinkit';
import { useParams } from 'react-router-dom';

const SprintOverview = () => {
  const { projectId } = useParams();
  const [openNewSprint, setOpenNewSprint] = useState(false);
  const [sprintNo, setSprintNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [message, setMessage] = useState('');
  const [upcomingSprints, setUpcomingSprints] = useState([]);
  const [completedSprints, setCompletedSprints] = useState([]);
  const [currentSprint, setCurrentSprint] = useState([]);

  useEffect(() => {
    setLoading(true);
    getSprints(projectId).then((response) => {
      console.log(response);
      if (response.success) {
        const lastSprint = response.sprints[response.sprints.length - 1];
        if (lastSprint) {
          setSprintNo(lastSprint.sprintNo);
        }

        //Identifying the upcoming sprints
        const upcoming = response.sprints.filter(
          (sprint) => new Date(sprint.startTime) > new Date()
        );
        setUpcomingSprints(upcoming);

        //Identifying the completed Sprint
        const ended = response.sprints.filter(
          (sprint) => new Date(sprint.endTime) < new Date()
        );
        setCompletedSprints(ended);

        //Identifying the current sprint
        const current = response.sprints.filter(
          (sprint) =>
            new Date(sprint.startTime) <= new Date() &&
            new Date() < new Date(sprint.endTime)
        );
        setCurrentSprint(current);
        setLoading(false);
      } else {
        setMessage(response.message);
        setLoading(false);
        setOpenResponse(true);
      }
    });
  }, [openNewSprint]);

  return (
    <div className='sprintOverview'>
      {loading && <Spinkit />}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => setOpenResponse(false)}
        />
      )}
      {openNewSprint && (
        <AddSprint
          sprintNo={sprintNo}
          closeAddSprint={() => {
            setOpenNewSprint(false);
          }}
        />
      )}
      <div className='sprintOverview__navbar'>
        <BigDropDown />
        <Button
          onClick={() => {
            setOpenNewSprint(true);
          }}>
          New Sprint
        </Button>
      </div>
      <div className='sprintOverview__content'>
        <div className='sprintOverview__contentLeft'>
          <div className='sprintOverview__contentOverview'>
            <div className='sprintOverview__header'>Current Sprint</div>
            <div className='sprintOverview__contentOverviewLarge'>
              {currentSprint.length !== 0 ? (
                currentSprint.map((sprint) => (
                  <CurrentSprintOverview
                    key={sprint._id}
                    _id={sprint._id}
                    completed={sprint.completed}
                    endTime={sprint.endTime}
                    ongoing={sprint.ongoing}
                    pending={sprint.pending}
                    projectId={sprint.projectId}
                    sprintNo={sprint.sprintNo}
                    startTime={sprint.startTime}
                    velocity={sprint.velocity}
                  />
                ))
              ) : (
                <div className='noData__text'>No current sprint</div>
              )}
            </div>
          </div>
        </div>
        <div className='sprintOverview__contentRight'>
          <div className='sprintOverview__contentRightTop'>
            <div className='sprintOverview__header'>Upcoming Sprint</div>
            <div className='sprintOverview__contentOverviewSmall'>
              {upcomingSprints.length !== 0 ? (
                <div style={{ height: '95%' }}>
                  <Scrollable>
                    {upcomingSprints.map((sprint) => (
                      <SingleSprintOverview
                        key={sprint._id}
                        _id={sprint._id}
                        completed={sprint.completed}
                        endTime={sprint.endTime}
                        ongoing={sprint.ongoing}
                        pending={sprint.pending}
                        projectId={sprint.projectId}
                        sprintNo={sprint.sprintNo}
                        startTime={sprint.startTime}
                        velocity={sprint.velocity}
                      />
                    ))}
                  </Scrollable>
                </div>
              ) : (
                <div className='noData__text' style={{ fontSize: '1.1vw' }}>
                  No Upcoming sprint
                </div>
              )}
            </div>
          </div>
          <div className='sprintOverview__contentRightBottom'>
            <div className='sprintOverview__contentOverview'>
              <div className='sprintOverview__header'>Completed Sprint</div>
              <div className='sprintOverview__contentOverviewSmall'>
                {completedSprints.length !== 0 ? (
                  <div style={{ height: '95%' }}>
                    <Scrollable>
                      {completedSprints.map((sprint) => (
                        <SingleSprintOverview
                          key={sprint._id}
                          _id={sprint._id}
                          completed={sprint.completed}
                          endTime={sprint.endTime}
                          ongoing={sprint.ongoing}
                          pending={sprint.pending}
                          projectId={sprint.projectId}
                          sprintNo={sprint.sprintNo}
                          startTime={sprint.startTime}
                          velocity={sprint.velocity}
                        />
                      ))}
                    </Scrollable>
                  </div>
                ) : (
                  <div className='noData__text' style={{ fontSize: '1.1vw' }}>
                    No Completed sprint
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintOverview;