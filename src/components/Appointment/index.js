import React from "react";
import "components/Appointment/styles.scss";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
//custom hook imported to manage UI transitions
import useVisualMode from "hooks/useVisualMode";

//constants for managing state changes
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM_DELETE = "CONFIRM_DELETE";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

//element displays an individual appointment in it's current mode(UI state)
export default function Appointment(props) {
  //custom hook imported to manage UI transitions
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  /**
   * save - handle user clicking save in the form mode
   * @param {*} name - student name
   * @param {*} interviewer - the selected interviewer ID number
   */
  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props.bookInterview(props.id, interview)
      .then(() => transition('SHOW'))
      .catch(() => transition('ERROR_SAVE', true));
  }

  /**
   * deleteAppointment - handle user clicking delete on a booked appointment
   */
  const deleteAppointment = function() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(() => transition('EMPTY'))
    .catch(() => transition('ERROR_DELETE', true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM_DELETE)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && (
        <Status
          message="Saving"
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment."
          onClose={back}
        />
      )}
      {mode === CONFIRM_DELETE && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={deleteAppointment}
          onCancel={back}
        />
      )}
      {mode === DELETING && (
        <Status
          message="Deleting"
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not delete appointment."
          onClose={back}
        />
      )}
    </article>
  );
}