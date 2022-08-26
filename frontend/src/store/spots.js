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
    dispatch(load(data.Spots));
    return response;
  }
};

export const getSpotById = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`)
  if (response.ok) {
    const data = await response.json();
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
    dispatch(updateSpot(data));
    return data;
  }
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE"
  })
  if (response.ok) {
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
      action.spots.forEach(spot => {
        newState[spot.id] = spot;
      });
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
      delete newState[action.spotId];
      return newState;
    case CREATE_PREVIEW_IMAGE:
      newState = {
        ...state,
        [action.spotId]: {
          ...state[action.spotId],
          previewImage: action.url
        }
      };
      return newState
    default:
      return state;
  }
};

export default spotsReducer;
