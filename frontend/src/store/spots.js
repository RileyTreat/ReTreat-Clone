import { csrfFetch } from './csrf';

//Action types
const CREATE_SPOT = "spots/createSpot"
const READ_SPOT = "spots/readSpot"
const READ_ALL_SPOTS = "spots/readAllSpots"
const UPDATE_SPOT = "spots/updateSpot"
const DELETE_SPOT = "spots/deleteSpot"

//Action Creators
// const createSpot = (spot) => {
//     return{
//         type: CREATE_SPOT,
//         payload: spot
//     }
// }

// const readSpot = () => {
//     return{
//         type: READ_SPOT,
//     }
// }

const readAllSpots = (spots) => {
    return{
        type: READ_ALL_SPOTS,
        spots
    }
}

// const updateSpot = (spot) => {
//     return{
//         type: UPDATE_SPOT,
//         payload: spot
//     }
// }

// const deleteSpot = (spotId) => {
//     return{
//         type: DELETE_SPOT,
//         payload: spotId
//     }
// }

// const = () => {
//     return{
//         type: ,
//     }
// }

export const loadAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
      method: 'GET'
    });
    if(response.ok){
        const data= await response.json();
         dispatch(readAllSpots(data.Spots));
    }
    return response;
  };

//   export const loadSpot = () => async (dispatch) => {
//     const response = await csrfFetch(`/api/spots/${spotId}`, {
//       method: 'GET'
//     });
//     if(response.ok){
//         const data= await response.json();
//         // console.log(data)
//          dispatch(loadSpot(data));
//     }
//     return response;
//   }; 

const initialState = {}
const spotReducer = (state = initialState, action) => {
 
    switch(action.type){
        case CREATE_SPOT:
            return {};
        case READ_SPOT:
            return {};
        case READ_ALL_SPOTS:
            // console.log('HIIII', action)
            const spots= {}
            if(action.spots) 
                action.spots.forEach(spot => {spots[spot.id] = spot})
            return spots
            
        case UPDATE_SPOT:
            return {};
        case DELETE_SPOT:
            return {};
        default:
            return state;
    }
}

export default spotReducer;
