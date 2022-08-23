import { csrfFetch } from './csrf';

// types (CRUD)
const LOAD = 'spots/getAllSpots';
const READ = 'spots/readSpot'

// actions
const load = spots => {
  return {
    type: LOAD,
    spots,
  };
};

const read = spot => {
  return {
    type: READ,
    spot,
  }
}

// thunks
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    // console.log('data from thunk', data)
    // console.log('data.Spots from thunk', data.Spots)
    dispatch(load(data.Spots));
    return response;
  }
};

export const getSpotById = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`)
  if (response.ok) {
    const data = await response.json();
    // console.log('data from getSpotById thunk', data)
    // console.log('data.Spots from thunk', data.Spots)
    dispatch(read(data));
    return response;
  }
};

// reducer
const initialState = {};

const spotsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD:
      newState = {...state}
      // console.log('state from inside reducer', state)
      // console.log('action.spots from inside reducer', action.spots)
      action.spots.forEach(spot => {
        // console.log('spot.id inside forEach loop', spot.id)
        newState[spot.id] = spot;
      });
      // console.log('newState after forEach loop', newState)
      return newState;
    case READ:
      newState = {...state, spots: {...state.spots}}
      newState = {...state, [action.spot.id]: {...action.spot}}
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
