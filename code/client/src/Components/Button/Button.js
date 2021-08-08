import React from 'react';
import './Button.css';

const Button = (props) => {
  let button;
  button = props.green === 'green' ? 'greenButton' : 'button';
  button = props.red === 'red' ? 'redButton' : button;
  button = props.neutral === 'neutral' ? 'neutral' : button;
  return (
    <div className={button} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default Button;
