import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss";
import PropTypes from 'prop-types';

//element displays interviewers to choose from when creating or editing an appointment
export default function InterviewerList(props) {
  const InterviewerListItems = props.interviewers.map(interviewer => {
    return <InterviewerListItem 
    key={interviewer.id}
    name={interviewer.name} 
    avatar={interviewer.avatar} 
    selected={interviewer.id === props.value}
    setInterviewer={(event) => props.onChange(interviewer.id)}  />;
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{InterviewerListItems}</ul>
    </section>
  );
}
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};