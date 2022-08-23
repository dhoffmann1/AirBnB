import { csrfFetch } from './csrf';

// types (CRUD)
const LOAD = 'spots/getAllSpots';

// actions
const load = spots => {
  return {
    type: LOAD,
    spots,
  };
};

// thunks
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const data = await response.json();
    console.log('data from thunk', data)
    console.log('data.Spots from thunk', data.Spots)
    dispatch(load(data.Spots));
    return response;
  }
};

// export const getAllSpots = () => async (dispatch) => {
//   const resSpots = await csrfFetch('/api/spots');
//   const resReviews =
//   if (response.ok) {
//     const data = await response.json();
//     console.log('data from thunk', data)
//     console.log('data.Spots from thunk', data.Spots)
//     dispatch(load(data.Spots));
//     return response;
//   }
// };

// reducer
const initialState = {};

const spotsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD:
      newState = {...state}
      console.log('state from inside reducer', state)
      console.log('action.spots from inside reducer', action.spots)
      action.spots.forEach(spot => {
        console.log('spot.id inside forEach loop', spot.id)
        newState[spot.id] = spot;
      });
      console.log('newState after forEach loop', newState)
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
