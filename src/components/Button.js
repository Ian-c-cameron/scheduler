import React from "react";
import classNames from "classnames"
import "components/Button.scss";

//element provides a button which the user may click
export default function Button(props) {
  let buttonClass = classNames("button", {
    "button--confirm": props.confirm,
    " button--danger": props.danger
  });

  return (
    <button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
