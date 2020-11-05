import React from "react";
import classNames from "classnames"
import "components/InterviewerListItem.scss";

//element displays a single interviewer
export default function InterviewerListItem(props) {
  const InterviewerListClasses = classNames("interviewer-list__item",{
    "day-list__item--selected": props.selected
  })

  return (
  <li className={InterviewerListClasses} onClick={props.setInterviewer}>
    <img
      className="interviewers__item-image"
      src={props.avatar}
      alt={props.name}
    />
    {props.selected && props.name}
  </li>)
}