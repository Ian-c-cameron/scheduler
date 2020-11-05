import { useReducer, useEffect } from "react";
import axios from "axios";

/**
 * useApplicationData - a custom hook for managing
 * main site data and maintaining consistency with the server 
 */
export default function useApplicationData(){
  /**
   * reducer - reducer function for using useReducer to manage site state
   * @param {*} state - the current site state
   * @param {*} action - the data that needs to change
   */
  function reducer(state, action) {
    return { ...state, ...action.value } || state;
  }

  //state - the main site data
  const [state, dispatch] = useReducer(reducer, {days: [], day: "Monday", appointments: {}, interviewers: {}});
  
  //Load all initial site data
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then((all) => {
        dispatch({ value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data}});
      })
      .catch((e) => console.log(e));
  }, []);

  /**
   * setDay - selects a given day in the week
   * @param {*} day - the day to select
   */
  const setDay = function(day) {
    return dispatch({ value: { day } })
  };

/**
 * bookInterview - saves a new appointment, or edits an existing one
 * @param {*} id - the id of the appointment to book
 * @param {*} interview - an interview object to store
 */
  function bookInterview(id, interview) {
    //create an appointment object to send to the server
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    //send the appointment
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        const value = {}
        //change the number of spots if it is a new appointment
        if (!state.appointments[id].interview) {
          value.days = state.days.map((day) => {
            if (day.name === state.day) {
              return {...day, spots: (day.spots - 1)}
            }
            return {...day};
          });
        }
        //recreate the list of objects with our new appointment
        value.appointments = {
          ...state.appointments,
          [id]: appointment
        };
        //add value to the current state
        dispatch({ value })
      })
  };

  /**
   * cancelInterview - delete a given appointment
   * @param {*} id - the id of the appointment to delete
   */
  function cancelInterview(id) {
    let appointments = {...state.appointments};
    
    //request that the server delete the appointment
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      //delete the interview data from client side data
      appointments[id].interview = null;
      //update the number of spots available
      let days = state.days.map((day) => {
        if (day.name === state.day) {
          return {...day, spots: (day.spots + 1)}
        }
        return {...day};
      });
      //store the updated data in state
      dispatch({ value: { appointments, days }})
    })
  };

  return {state, setDay, bookInterview, cancelInterview};
};