import React from "react";
import { Link } from "react-router-dom";

const landing = () => {
  return (
    <div>
      <div className="landing__navbar">
        <div className="landing__container">
          {/*<div className="landing__navlogo">teamup.</div>*/}
          <link to="/" className="landing__navlogo">
            teamup.
          </link>
          <div className="landing__menuIcon"></div>
        </div>
      </div>
    </div>
  );
};

export default landing;
