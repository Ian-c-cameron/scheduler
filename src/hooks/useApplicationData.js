import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_ADD_INTERVIEW = "SET_ADD_INTERVIEW";
const SET_REMOVE_INTERVIEW = "SET_REMOVE_INTERVIEW";

export default function useApplicationData(){
  function reducer(state, action) {
    const reducers = {
      SET_DAY(state, action) {
        return { ...state, ...action.value };
      },
      SET_APPLICATION_DATA(state, action) {
        return {...state, ...action.value};
      },
      SET_ADD_INTERVIEW(state, action) {
        return {
          ...state,
          ...action.value
        }
      },
      SET_REMOVE_INTERVIEW(state, action) {
        let days = state.days.map((day) => {
          if (day.name === state.day) {
            return {...day, spots: (day.spots + 1)}
          }
          return {...day};
        });
        return {
          ...state,
          days,
          ...action.value
        }
      }
    }
    return reducers[action.type](state, action) || state;
  }
  const [state, dispatch] = useReducer(reducer, {days: [], day: "Monday", appointments: {}, interviewers: {}});
  const setDay = day => dispatch({ type: SET_DAY, value: { day } });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then((all) => {
        dispatch({type: SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data}});
      })
      .catch((e) => console.log(e));
  }, []);

  function bookInterview(id, interview) {
    const value = {}
    if (!state.appointments[id].interview) {
      value.days = state.days.map((day) => {
        if (day.name === state.day) {
          return {...day, spots: (day.spots - 1)}
        }
        return {...day};
      });
    }
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    value.appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_ADD_INTERVIEW, value}))
  };

  function cancelInterview(id) {
    let appointments = {...state.appointments};
    appointments[id].interview = null;
    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({ type: SET_REMOVE_INTERVIEW, value: { appointments }}))
  };

  return {state, setDay, bookInterview, cancelInterview};
};