import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

//element displays the form for creating a new appointment
export default function Form(props) {
  //the contents of the name input field
  const [ name, setName ] = useState(props.name || "");
  //the currently selected interviewer's id
  const [ interviewer, setInterviewer ] = useState(props.interviewer || null);
  //the error message should one need to be displayed
  const [error, setError] = useState("");

  /**
   * reset - reset form values if the user cancels
   */
  const reset = function() {
    setName("");
    setInterviewer(null);
  }

  /**
   * cancel - handle when the user clicks cancel
   */
  const cancel = function() {
    reset();
    props.onCancel();
  }

  /**
   * validate - checks that the user has entered a name before saving
   */
  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    setError("");
    props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  );
}