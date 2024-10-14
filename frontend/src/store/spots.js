import { csrfFetch } from './csrf';

//Action types
const CREATE_SPOT = "spots/createSpot"

const READ_SPOT = "spots/readSpot"
const READ_ALL_SPOTS = "spots/readAllSpots"
const UPDATE_SPOT = "spots/updateSpot"
const DELETE_SPOT = "spots/deleteSpot"

//Action Creators
const createSpot = (newSpot) => {
    return{
        type: CREATE_SPOT,
        payload: newSpot
    }
}

// const createSpotImage = (spot) => ({
//     type: CREATE_SPOT_IMAGE,
//     payload: spot,
// });

const readSpot = (spot) => {
    return{
        type: READ_SPOT,
        spot
    }
}

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

//THUNKS

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

  export const readSpotThunk = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`,{
        method: 'GET'
    })
    if(response.ok){
        const data = await response.json()
        dispatch(readSpot(data))
    }
  }

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

export const createSpotThunk = (spotData) => async (dispatch) => {

        const response = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spotData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create spot');
        }

        const newSpot = await response.json();
        dispatch(createSpot(newSpot));
        return newSpot;

};

  const initialState = {}
//  const initialState = {
//     spots: { error: null },
//     isLoaded: false,
//     current: { isLoaded: false, error: null },
//   };


const spotReducer = (state = initialState, action) => {
 
    switch(action.type){
        case CREATE_SPOT:
            const newState = { ...state };
            newState[action.payload.id] = {...action.payload};
            return newState;
        case READ_SPOT:
            newState = {...state}
            newState[action.payload.id] = action.payload
            return newState;
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
        // case CREATE_SPOT_ERROR: {
        //     return { ...state, error: action.error };
        //     }
        default:
            return state;
    }
}

export default spotReducer;
