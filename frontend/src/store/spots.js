import { csrfFetch } from './csrf';

//Action types
const CREATE_SPOT = "spots/createSpot"
const READ_SPOT = "spots/readSpot"
const READ_ALL_SPOTS = "spots/readAllSpots"
// const UPDATE_SPOT = "spots/updateSpot"
const DELETE_SPOT = "spots/deleteSpot"
//const LOAD_REVIEWS = 'spot/load_reviews'

//Action Creators
const createSpot = (newSpot) => {
    return{
        type: CREATE_SPOT,
        payload: newSpot
    }
}


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

const deleteSpot = (spotId) => {
    return{
        type: DELETE_SPOT,
        payload: spotId
    }
}
// const loadReviews = (spotId) => {
//     return {
//       type: LOAD_REVIEWS,
//       spotId
//     }
//   }


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
    //console.log("HIIII", id)
    if(response.ok){
        const data = await response.json()
         //  console.log("DATAA", data)
        dispatch(readSpot(data))
       // console.log("RESPONSE", response)
        return data 
   
   
    }
   
  }

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

  export const updateSpotThunk = (id, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`,{
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    })
    if(response.ok){
        const data = await response.json()
        dispatch(updateSpot(data))
        return data
    }
  }

//   export const getReviewsBySpotIdThunk = (spotId) => async(dispatch) => {
//     const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  
//     if (response.ok) {
//       const data = await res.json();
//       dispatch(loadReviews(data.Reviews));
//       return response;
//     }
//   }

export const deleteSpotThunk = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}`, {
      method: 'DELETE'
    });
    if(response.ok){
        //const data= await response.json();
        // console.log(data)
         dispatch(deleteSpot(id));
    }
    return response;
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
             newState = { ...state };
            newState[action.payload.id] = {...action.payload};
            return newState;
        case READ_SPOT:
            const newState = {...state}
            console.log("update spot", action.spot)
            newState[action.spot.id] = {...action.spot}
            return newState;
        case READ_ALL_SPOTS:
            // console.log('HIIII', action)
            const spots= {}
            if(action.spots) 
                action.spots.forEach(spot => {spots[spot.id] = spot})
            return spots
        // case UPDATE_SPOT:
        //     return {
        //         ...state, 
        //         [action.payload.id]: action.payload
        //     };
        case DELETE_SPOT:
            newState = {...state}
            delete newState[action.spotId]
            return newState;
            // case LOAD_REVIEWS: 
            //     newState = {...state, Reviews: action.spotId};
            //     return newState
        default:
            return state;
    }
}

export default spotReducer;
