import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReviewsBySpotIdThunk, createReviewForSpotThunk, deleteReviewThunk } from '../../store/reviews';
// import reviewsBarImage from './images/review-bars.jpg'
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
  }, [dispatch, spot])


  const deleteReviewFunc = (reviewId) => {
    dispatch(deleteReviewThunk(reviewId))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    if (spot.ownerId === user.id) return alert(`${user.firstName}, you cannot leave a review for your own spot.`);
    if (reviewsArray.some(review => review.userId === user.id)) return alert(`${user.firstName}, you already have a review for this Spot.  Please see below.`);
    if (review.length > 50) return alert('Review must be equal to or under 50 characters.')
    setShowReviewField(false)
    dispatch(createReviewForSpotThunk(spot.id, { review, stars: parseInt(stars) }))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      )
    return setReview('');
  };

  if (!reviewsArray) return null;

  return (
    <main id='reviews-main-container'>
      <div id='avg-ratings-and-reviews-container'>
        {isNaN(Number.parseFloat(spot.avgStarRating).toFixed(2)) && <div><i class="fa-solid fa-star" /> • {spot.numReviews} reviews</div>}
        {!isNaN(Number.parseFloat(spot.avgStarRating).toFixed(2)) && <div><i class="fa-solid fa-star" />{Number.parseFloat(spot.avgStarRating).toFixed(2)} • {spot.numReviews} reviews</div>}
        {/* <div id='average-rating2'><i class="fa-solid fa-star" /> {Number.parseFloat(spot.avgStarRating).toFixed(2)} • {spot.numReviews} reviews</div> */}
      </div>
      {/* <div id='reviewBarImage'>
        <img src={reviewsBarImage} alt='X'/>
      </div> */}
      <div id='reviews-list-container'>
        <div id='reviews-list'>
            {reviewsArray.map((review, index) => {
              return (
                <div key={review.id} id={`review-${index+1}`} className='single-review-container'>
                  <div style={{ fontWeight: 'bold'}}><i class="fa-solid fa-circle-user"></i>{review.User?.firstName} commented:</div>
                  <div id='review-dates'>{review.updatedAt.slice(0, 10)}</div>
                  <div>{review.review}</div>
                  {/* <div>{review.stars} stars</div> */}
                  {user?.id === review.userId &&
                    <div id='review-buttons-container'>
                      {/* <button id='edit-review-button'>Edit Comment</button> */}
                      <div id='delete-review-button' onClick={() => deleteReviewFunc(review.id)}>Delete Comment</div>
                    </div>
                  }
                </div>
              )
            })}
        </div>
      </div>
      {!user &&
        <div id='review-new-review-form-container'>
          <div id='review-reveal-form-button'>
            <button className='new-review-buttons' onClick={() => alert('Please login to leave a review.')}>Leave A Review</button>
          </div>
        </div>}
      {user &&
        <div id='review-new-review-form-container'>
          {!showReviewField && (
            <div id='review-reveal-form-button'>
              <button className='new-review-buttons' onClick={() => setShowReviewField(true)}>Leave A Review</button>
            </div>
          )}
          {showReviewField && (
              <form id='reviews-form-new-with-errors-container' onSubmit={handleSubmit}>
                <ul>
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
                </ul>
                <div id='reviews-form'>
                  <textarea
                    type="text"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    rows="4"
                    cols="20"
                    wrap="hard"
                    placeholder="Type your review here"
                    id="review-text-area"
                  />
                  <div id='review-stars-div'>
                    <div id='review-stars-div-text'>Select Star Rating 1-5</div>
                    <select
                      name='stars'
                      id='review-stars-menu'
                      form='reviews-form'
                      onChange={(e) => setStars(e.target.value)}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                  </div>
                  <div id='review-submit-cancel-buttons-container'>
                    <input id='review-submit-button' type='submit' value='Submit Review' />
                    <button id='review-cancel-submission' onClick={() => {
                      setReview('')
                      setShowReviewField(false)}}>Nevermind</button>
                  </div>
                </div>
              </form>
          )}
        </div>
      }
    </main>
  );

}

export default ReviewsBySpotId;
