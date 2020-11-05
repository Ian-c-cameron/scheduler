/**
 * getAppointmentsForDay - retrieves a list of appointments for a given day
 * @param {*} state - the current state object
 * @param {*} selectDay - the day to retrieve
 * returns - an array of appointment objects
 *  - an empty array if the day doesn't exist in state
 */
const getAppointmentsForDay = function(state, selectDay) {
  const filteredDays = state.days.filter(day => day.name === selectDay);
  if (!filteredDays[0]){
    return [];
  }
  return filteredDays[0].appointments.map(appointment => state.appointments[`${appointment}`]);
}

/**
 * getInterviewersForDay - retrieves a list of interviewers for a given day
 * @param {*} state - the current state object
 * @param {*} selectDay - the day to retrieve
 * returns - an array of interviewer objects
 *  - an empty array if the day doesn't exist in state
 */
const getInterviewersForDay = function(state, selectDay) {
  const filteredDays = state.days.filter(day => day.name === selectDay);
  if (!filteredDays[0]){
    return [];
  }
  return filteredDays[0].interviewers.map(interviewer => state.interviewers[`${interviewer}`]);
}

/**
 * getInterview - retrieves the student name and interviewer for a given interview
 * @param {*} state - the current state object
 * @param {*} interview - an interview object
 * returns - an object containing student name and interviewer object
 */
const getInterview = function(state, interview) {
  if (!interview) {
    return null;
  }
  const student = interview.student
  const interviewer = state.interviewers[interview.interviewer];
  return { student, interviewer }
}

export {getAppointmentsForDay, getInterview, getInterviewersForDay};