import React from "react";
import "./Signin.css";
import image from "./signin_image.svg";

const Signin = () => {
  return (
    <div className="signin">
      <div className="signin__navbar">teamup.</div>
      <div className="signin__content">
        <div className="signin__contentLeft">
          <div className="signin__bigTextContainer">
            <div className="signin__bigText">
              Let's make the world productive,
            </div>
            <div className="signin__bigText">together.</div>
          </div>
          <div className="signin__imageContainer">
            <img className="signin__image" src={image} alt="" />
          </div>
        </div>
        <div className="signin__contentRight">
          <form className="signin__form">
            <div className="signin__header">Welcome!</div>
            <div className="signin__inputdiv">
              <div className="signin__label">Username</div>
              <input className="signin__input" type="text" />
            </div>
            <div className="signin__inputdiv">
              <div className="signin__label">Email</div>
              <input className="signin__input" type="text" />
            </div>
            <div className="signin__inputdiv">
              <div className="signin__label">Password</div>
              <input className="signin__input" type="password" />
            </div>
            <div className="signin__buttondiv">
              <button className="signin__button">Sign In</button>
            </div>
            <div className="signin__switchState">
              <div>Don't have an account?</div>
              <div className="signin__orange">Sign In</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
