import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotById } from '../../store/spots';
import ReviewsBySpotId from '../Reviews';
import './SpotDetails.css'

const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots[spotId]);
  // console.log('spot from SpotDetails component', spot);
  let spotsImagesArray = spot?.Images;
  // console.log(spotsImagesArray);
  let spotReviews = useSelector(state => state.reviews)
  spotReviews = Object.values(spotReviews);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpotById(spotId))
  }, [dispatch, spotId, spotReviews.length]);

  if (!spot || !spot.Images) {
    return null;
  }

  let orderedImagesArray = [];
  for (let image of spotsImagesArray) {
    if (image.url === spot.previewImage) orderedImagesArray.push(image)
  }
  for (let image of spotsImagesArray) {
    if (image.url !== spot.previewImage) orderedImagesArray.push(image)
  }
  // console.log(orderedImagesArray)

  return (
    <main id='spot-main-container'>
      <div id='spot-main-area'>
        <div id='header-details-container'>
          <div id='spot-name'>{spot.name}</div>
          <div id='spot-sub-details'>
            {isNaN(Number.parseFloat(spot.avgStarRating).toFixed(2)) && <div id='average-rating'><i class="fa-solid fa-star" /></div>}
            {!isNaN(Number.parseFloat(spot.avgStarRating).toFixed(2)) && <div id='average-rating'><i class="fa-solid fa-star" />{Number.parseFloat(spot.avgStarRating).toFixed(2)}</div>}
            {/* <div id='average-rating'><i class="fa-solid fa-star" /> {Number.parseFloat(spot.avgStarRating).toFixed(2)}</div> */}
            <div className='circle'>•</div>
            <div id='count-reviews'>{spot.numReviews} reviews</div>
            <div className='circle'>•</div>
            <div id='city-state-info'>{spot.city}, {spot.state}, {spot.country}</div>
          </div>
        </div>
        <div id='images-container'>
          {orderedImagesArray.map((image, index) => {
            return (
              <div id={`image${index+1}`} key={index} className='spot-details-images-containers'>
                <img className='spot-details-images' id={`image-img-${index+1}`} src={image.url} alt='images'/>
              </div>
            )
          })}
        </div>
        <div id='host-container'>
          <div id='host-name'>Spot hosted by {spot.Owner.firstName}</div>
          <div id='host-image'><i class="fa-solid fa-user-astronaut" id='host-image-image'></i></div>
        </div>
        <div id='description-container'>
          <div id='description-info'>{spot.description}</div>
        </div>
        <div id='reviews-container'>
          {/* <div id='avg-ratings-and-reviews-container'>
            <div id='average-rating2'><i class="fa-solid fa-star" /> {Number.parseFloat(spot.avgStarRating).toFixed(2)} • {spot.numReviews} reviews</div>
          </div>
          <div id=''>
            <img src={reviewsBarImage} alt='X'/>
          </div> */}
          <div id='reviews-component'>
            <ReviewsBySpotId spot={spot}/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SpotDetails;
