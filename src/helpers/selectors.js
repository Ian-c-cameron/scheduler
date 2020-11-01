const getAppointmentsForDay = function(state, selectDay) {
  const filteredDays = state.days.filter(day => day.name === selectDay);
  if (!filteredDays[0]){
    return [];
  }
  return filteredDays[0].appointments.map(appointment => state.appointments[`${appointment}`]);
}

const getInterviewersForDay = function(state, selectDay) {
  const filteredDays = state.days.filter(day => day.name === selectDay);
  if (!filteredDays[0]){
    return [];
  }
  return filteredDays[0].interviewers.map(interviewer => state.interviewers[`${interviewer}`]);
}

const getInterview = function(state, interview) {
  if (!interview) {
    return null;
  }
  const student = interview.student
  const interviewer = state.interviewers[interview.interviewer];
  return { student, interviewer }
}

export {getAppointmentsForDay, getInterview, getInterviewersForDay};