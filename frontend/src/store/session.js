// frontend/src/store/session.js

import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;

// import {csrfFetch} from "./csrf"

// const ADD_USER = 'session/addUser'
// const REMOVE_USER = 'seesion/removeUser'

// const addUser = (payload) => ({
//     type: ADD_USER, 
//     payload
// })

// const removeUser = () => ({
//     type: REMOVE_USER,

// })

// export const login = ({credential, password}) => async dispatch => {
//     let res = await csrfFetch('/api/session', {
//         method: 'POST',
//         body:JSON.stringify({credential, password})
//     })  

//     if(res.ok){
//         res = await res.json()
//         dispatch(addUser(res))
//         return res
//     }
// }

// const initialState = {user: null}

// const session = (state= initialState, action) => {
//     switch (action.type) {
//         case ADD_USER: { 
//             const newState = {...state}
//             newState.user = action.payload
//             return newState}
//         case REMOVE_USER: {
//             return initialState
//         }
//         default:
//            return state
//     }
// }

// export default session;
