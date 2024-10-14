import { csrfFetch } from './csrf';

const ADD_SPOT_IMAGE = "spots/createSpotImage"

const createSpotImage = (payload) => ({
    type: ADD_SPOT_IMAGE,
    payload,
  });

export const createSpotImageThunk = (id, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if(response.ok){
        const data = await response.json()
        dispatch(createSpotImage(data))
    }
}

const initialState = {};

const spotImageReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
          case ADD_SPOT_IMAGE:
            newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
          default:
            return state;
        }
    }


export default spotImageReducer
