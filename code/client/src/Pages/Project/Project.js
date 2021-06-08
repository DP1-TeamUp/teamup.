import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { deepPurple } from "@material-ui/core/colors";
import "./Project.css";
import DropDown from "../../Components/DropDown/DropDown";
import NewProject from "../../Modals/NewProject/NewProject";
import ResponseModal from "../../Modals/ResponseModal/ResponseModal";
import Spinkit from "../../Modals/Spinkit/Spinkit";

const useStyles = makeStyles((theme) => ({
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "3vh",
  },
}));

const Project = () => {
  const classes = useStyles();
  const user = JSON.parse(sessionStorage.getItem("jwt"));
  const [openForm, setOpenForm] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [message, setMessage] = useState("");
  const [loadinga, setLoadinga] = useState(false);

  return (
    <div className="project">
      {loadinga && <Spinkit />}
      {openForm && (
        <NewProject
          close={() => {
            setOpenForm(!openForm);
          }}
          admin={user.user._id}
          setMessage={(str) => setMessage(str)}
          setOpenResponse={() => {
            setOpenResponse(!openResponse);
          }}
          setLoading={() => setLoadinga(!loadinga)}
        />
      )}
      {openResponse && (
        <ResponseModal
          message={message}
          setOpen={() => setOpenResponse(false)}
        />
      )}

      <div className="project__navbar"> 
        <div className="project__logo">teamup.</div>
        <div className="project__accountInfo">
          <Avatar className={classes.purple}>
            {user ? user.user.name[0] : "N"}
          </Avatar>
          <div className="project__name">{user ? user.user.name : "Nafiz"}</div>
        </div>
      </div>
      <div className="project__content">
        <div className="project__contentText">
          <div>Create projects or collaborate</div>
          <div>with your team</div>
        </div>
        <div className="project__buttondiv">
          <div className="project__buttondrop">
            <DropDown />
          </div>
          <div className="project__smallText">Or</div>
          <button
            className="project__button"
            onClick={() => {
              setOpenForm(true);
            }}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;
