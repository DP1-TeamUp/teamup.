import React from "react";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "./Dashboard.css";
import BigDropDown from "../../Components/BigDropDown/BigDropDown";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__navbar">
        <BigDropDown />
      </div>
      <div className="dashboard__content">
        <div className="dashboard__contentColumnOne">
          <div className="dashboard__projectDescription">
            <div className="dashboard__descriptionTitle">
              Project Description
            </div>
            <div className="dashboard__description">
              It is a web application for managing projects and work together.
              It can also be used for academic purposes.
            </div>
          </div>
          <div className="dashboard__sprintSection">
            <div className="dashboard__title">
              <div className="dashboard__titleName">Current Sprint</div>
              <div className="dashboard__orange">
                <div className="dashboard__orangeText">Details</div>
                <div className="dashboard__orangeIcon">
                  <NavigateNextIcon />
                </div>
              </div>
            </div>
            <div className="dashboard__sprintContent"></div>
          </div>
        </div>
        <div className="dashboard__contentColumnTwo">
          <div className="dashboard__myTaskSection">
            <div className="dashboard__title">
              <div className="dashboard__titleName">My Task</div>
              <div className="dashboard__orange">
                <div className="dashboard__orangeText">See All</div>
                <div className="dashboard__orangeIcon">
                  <NavigateNextIcon />
                </div>
              </div>
            </div>
            <div className="dashboard__myTaskContent"></div>
          </div>
          <div className="dashboard__collabBoardSection">
            <div className="dashboard__title">
              <div className="dashboard__titleName">Collab Board</div>
              <div className="dashboard__orange">
                <div className="dashboard__orangeText">Create Now</div>
                <div className="dashboard__orangeIcon">
                  <NavigateNextIcon />
                </div>
              </div>
            </div>
            <div className="dashboard__collabboardContext"></div>
          </div>
        </div>
        <div className="dashboard__contentColumnThree">
          <div className="dashboard__reportSection">
            <div className="dashboard__title">
              <div className="dashboard__titleName">Task Progress</div>
              <div className="dashboard__orange">
                <div className="dashboard__orangeText">Details</div>
                <div className="dashboard__orangeIcon">
                  <NavigateNextIcon />
                </div>
              </div>
            </div>
            <div className="dashboard__reportContent"></div>
          </div>
          <div className="dashboard__teamSection">
            <div className="dashboard__title">
              <div className="dashboard__titleName">Team Members</div>
              <div className="dashboard__orange">
                <div className="dashboard__orangeText">Details</div>
                <div className="dashboard__orangeIcon">
                  <NavigateNextIcon />
                </div>
              </div>
            </div>
            <div className="dashboard__teamContent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
