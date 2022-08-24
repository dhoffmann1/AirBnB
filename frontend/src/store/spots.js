import { csrfFetch } from './csrf';

// types (CRUD)
const LOAD = 'spots/getAllSpots';
const CREATE = 'spots/createSpot';
const READ = 'spots/readSpot';
const UPDATE = 'spots/updateSpot';
const DELETE = 'spots/deleteSpot';

const CREATE_PREVIEW_IMAGE = 'images/createImage'

// actions
const load = spots => {
  return {
    type: LOAD,
    spots
  };
};

const create = spot => {
  return {
    type: CREATE,
    spot
  }
};

const createImage = (spotId, url) => {
  return {
    type: CREATE_PREVIEW_IMAGE,
    spotId,
    url
  }
}

const read = spot => {
  return {
    type: READ,
    spot
  }
};

const updateSpot = spot => {
  return {
    type: UPDATE,
    spot
  }
}

const deleteSpot = spotId => {
  return {
    type: DELETE,
    spotId
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

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot)
  })
  if (response.ok) {
    const data = await response.json();
    // console.log('data from createSpot thunk', data)
    dispatch(create(data));
    return data;
  }
};

export const addPreviewImage = (spotId, url) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      previewImage: true
    })
  })
  if (response.ok) {
    // const data = await response.json();
    // console.log('data from getSpotById thunk', data)
    // console.log('data.Spots from thunk', data.Spots)
    dispatch(createImage(spotId, url));
    return response;
  }
};

export const updateSpotThunk = (spotId, spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot)
  })
  if (response.ok) {
    const data = await response.json();
    // console.log('data from createSpot thunk', data)
    dispatch(updateSpot(data));
    return data;
  }
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE"
  })
  if (response.ok) {
    // const data = await response.json();
    dispatch(deleteSpot(spotId));
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
      newState = {...state, [action.spot.id]: {...action.spot}};
      return newState;
    case CREATE:
      newState = {
        ...state,
        [action.spot.id]: {...action.spot}
      };
      return newState;
    case UPDATE:
      newState = {
        ...state,
        [action.spot.id]: {...action.spot}
      }
      return newState;
    case DELETE:
      newState = {...state};
      // console.log('action.spotId from spotsReducer', action.spotId)
      delete newState[action.spotId];
      return newState;
    case CREATE_PREVIEW_IMAGE:
      // console.log('action.spotId', action.spotId);
      newState = {
        ...state,
        [action.spotId]: {
          ...state[action.spotId],
          previewImage: action.url
        }
      };


      // console.log('action.spotId.previewImage', action.spotId.previewImage);
      console.log('state[action.spotId]', state[action.spotId]);
      console.log('action.url', action.url);
      // console.log('newState', newState)
      return newState
    default:
      return state;
  }
};

export default spotsReducer;
