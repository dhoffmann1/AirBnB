import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReviewsBySpotIdThunk, createReviewForSpotThunk, deleteReviewThunk } from '../../store/reviews';
import './Reviews.css';


function ReviewsBySpotId({ spot }) {
  const reviewsObj = useSelector(state => state.reviews);
  const reviewsArray = Object.values(reviewsObj);
  const user = useSelector(state => state.session.user)
  const [showReviewField, setShowReviewField] = useState(false)
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(1);
  const [errors, setErrors] = useState([]);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReviewsBySpotIdThunk(spot.id));
  }, [dispatch, spot, reviewsArray.length])

  // const createReviewFunc = () => {
  //   if (spot.ownerId === user.id) return alert(`${user.firstName}, you cannot leave a review for your own spot.`)
  //   if (reviewsArray.some(review => review.userId === user.id)) return alert(`${user.firstName}, you already have a review for this Spot.  Please see below.`);
  //   const review = document.getElementById('review-textArea').value
  //   const stars = parseInt(document.getElementById('review-stars-menu').value)
  //   dispatch(createReviewForSpotThunk(spot.id, { review, stars }))
  // }

  const deleteReviewFunc = (reviewId) => {
    dispatch(deleteReviewThunk(reviewId))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(createReviewForSpotThunk(spot.id, { review, stars: parseInt(stars) }))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
    )
  };


  if (!reviewsArray) return null;

  return (
    <main id='reviews-main-container'>
      <div id='reviews-grid-area'>
        {!showReviewField && (
          <div id='review-reveal-form-button'>
            <button onClick={() => setShowReviewField(true)}>Leave A Review</button>
          </div>
        )}
        {showReviewField && (
          <form id='reviews-form' onSubmit={handleSubmit}>
            <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
            </ul>
              <input
                type="textarea"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                placeholder="Type your review here"
                className="review-text-area"
              />
              <input
                type="number"
                id="vol"
                name="vol"
                min='1'
                max='5'
                onChange={(e) => setStars(e.target.value)}
                />
              <input id='review-submit-button' type='submit' value='Submit Review' />
              <button id='review-cancel-submission' onClick={() => setShowReviewField(false)}>Nevermind</button>
          </form>
        )}

        {/* <select
          name="stars"
          id="review-stars-menu"
          form='reviews-form'
          onChange={(e) => setStars(e.target.value)}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
        </select> */}
        <div id='reviews-list-container'>
          <div id='reviews-list'>
              {reviewsArray.map((review, i) => {
                return (
                  <div key={review.id} id={`${i}`} className='single-review-container'>
                    <div>{review.User?.firstName} commented:</div>
                    <div>{review.review}</div>
                    <div>{review.stars}</div>
                    {user.id === review.userId &&
                      <div id='review-buttons-container'>
                        {/* <button id='edit-review-button'>Edit Comment</button> */}
                        <button id='delete-review-button' onClick={() => deleteReviewFunc(review.id)}>Delete Comment</button>
                      </div>
                    }
                    {/* <br /> */}
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </main>
  );

}

export default ReviewsBySpotId;
