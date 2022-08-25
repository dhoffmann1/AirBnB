import { csrfFetch } from './csrf';

// types (CRUD)
const LOAD = 'reviews/getReviewBySpot';
const CREATE = 'reviews/createReview';
const DELETE = 'reviews/deleteReview';


// actions
const loadReviews = reviews => {
  return {
    type: LOAD,
    reviews
  };
};

const createReview = review => {
  return {
    type: CREATE,
    review
  }
};

const deleteReview = reviewId => {
  return {
    type: DELETE,
    reviewId
  }
};

// thunks
export const getReviewsBySpotIdThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  // console.log(response.ok)
  if (response.ok) {
    const data = await response.json();
    dispatch(loadReviews(data.Reviews));
    return response;
  }
};

export const createReviewForSpotThunk = (spotId, review) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review)
  })
  if (response.ok) {
    const data = await response.json();
    dispatch(createReview(data));
    return data;
  }
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  })
  if (response.ok) {
    // const data = await response.json();
    dispatch(deleteReview(reviewId));
    return response;
  }
};


// reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD:
      // newState = {...state}
      action.reviews.forEach(review => {
        newState[review.id] = review;
      });
      return newState;
    case CREATE:
      newState = {
        ...state,
        [action.review.id]: {...action.review}
      };
      return newState;
    case DELETE:
      newState = {...state}
      delete newState[action.reviewId]
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
